# frozen_string_literal: true

module Notes
  # Notes for the CRM portion of the app, attached to a user
  # rubocop:disable Metrics/ClassLength
  class Note < ApplicationRecord
    include SearchCop
    include NoteHistoryRecordable

    search_scope :search do
      attributes :created_at, :completed, :due_date, :flagged, :category, :body
    end

    search_scope :search_user do
      attributes :created_at, :completed, :due_date, :flagged, :category, :body
      attributes user: 'user.name'
    end

    search_scope :search_assignee do
      attributes :created_at, :completed, :due_date, :flagged, :category, :body
      attributes assignees: ['assignees.name']
    end

    search_scope :search_by_step do
      attributes :current_step_body
    end

    enum status: { not_started: 0, in_progress: 1, needs_attention: 2, at_risk: 3, completed: 4 }

    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :author, class_name: 'Users::User'
    belongs_to :form_user, class_name: 'Forms::FormUser', optional: true
    belongs_to :parent_note, class_name: 'Notes::Note', optional: true
    belongs_to :note_list, class_name: 'Notes::NoteList', optional: true
    has_many :assignee_notes, dependent: :destroy
    has_many :assignees, through: :assignee_notes, source: :user
    has_many :note_comments, class_name: 'Comments::NoteComment', dependent: :destroy
    has_many :note_histories, dependent: :destroy
    has_many :sub_notes, -> { unscope(:order).order(order: :asc) },
             class_name: 'Notes::Note',
             foreign_key: 'parent_note_id',
             dependent: :destroy,
             inverse_of: :parent_note
    has_many_attached :documents, dependent: :destroy
    has_paper_trail

    before_save :log_completed_at, if: -> { completed_changed? }
    after_create :log_create_event
    after_update :log_update_event
    after_save :update_parent_current_step, if: -> { parent_note_id.present? }

    default_scope { order(created_at: :desc) }
    scope :by_due_date, ->(date) { where('due_date <= ?', date) }
    scope :by_completion, ->(is_complete) { where(completed: is_complete) }
    scope :by_category, ->(category) { where(category: category) }
    scope :for_site_manager, lambda { |current_user|
                               unless %i[admin custodian].include? current_user.user_type.to_sym
                                 left_joins(:assignee_notes).where(
                                   arel_table[:author_id].eq(current_user.id)
                                      .or(Notes::AssigneeNote.arel_table[:user_id]
                                        .eq(current_user.id)),
                                 ).distinct
                               end
                             }

    VALID_CATEGORY = %w[
      call email text message to_do form emergency template task_list other
    ].freeze
    validates :category, inclusion: { in: VALID_CATEGORY, allow_nil: true }
    validates :body, presence: true,
                     uniqueness: { scope: :community_id,
                                   case_sensitive: false }, if: -> { category.eql?('template') }
    alias sub_tasks sub_notes

    def assign_or_unassign_user(assignee_id)
      a_notes = assignee_notes.find_by(user_id: assignee_id)
      if a_notes.present?
        a_notes.delete
      else
        assign = assignee_notes.create!(user_id: assignee_id, note_id: self[:id])
        create_notification(assignee_id)
        user.generate_events('task_assign', assign)
        assign
      end
    end

    def create_notification(assignee_id)
      NotificationCreateJob.perform_now(community_id: community.id,
                                        notifable_id: id,
                                        notifable_type: self.class.name,
                                        description: I18n.t('notification_description.task',
                                                            task: body),
                                        category: :task,
                                        user_id: assignee_id)
    end

    # rubocop:disable Metrics/MethodLength
    def self.tasks_by_quarter(community_id, process_id, task_category: :completed)
      community = Community.find_by(id: community_id)
      return unless community

      process_form_users = community.process_form_users(process_id)&.pluck(:id)
      query = "
        SELECT DATE_PART('year', completed_at) as yr, DATE_PART('quarter', completed_at) as qtr, \
        count(*) FROM notes WHERE completed = true AND community_id=?
        AND parent_note_id IS NULL AND form_user_id IN (?) GROUP BY yr, qtr;
      "

      if task_category == :submitted
        query = "
          SELECT DATE_PART('year', created_at) as yr, DATE_PART('quarter', created_at) as qtr, \
          count(*) FROM notes WHERE community_id=?
          AND parent_note_id IS NULL AND form_user_id IN (?) GROUP BY yr, qtr;
        "
      end

      sql = sanitize_sql_for_conditions([query, community_id, process_form_users])
      ActiveRecord::Base.connection.exec_query(sql).rows
    end
    # rubocop:enable Metrics/MethodLength

    def check_current_process_step
      parent_note.sub_notes&.where(completed: false)&.first
    end

    def update_parent_current_step
      parent_note.update(
        current_step_body: check_current_process_step&.body&.downcase&.tr(' ', '_'),
      )
    end

    # rubocop:disable Layout/LineLength
    # rubocop:disable Metrics/MethodLength
    def self.by_quarter(quarter, task_category: :completed)
      quarter_range = {
        'Q1' => [1, 3],
        'Q2' => [4, 6],
        'Q3' => [7, 9],
        'Q4' => [10, 12],
        'ytd' => [1, 12],
      }

      unless quarter_range.keys.include?(quarter)
        raise 'Invalid argument. quarter should be either Q1, Q2, Q3 or Q4'
      end

      months = quarter_range[quarter]
      query = "date_part('year', completed_at) = ? AND date_part('month', completed_at) >= ? AND  date_part('month', completed_at) <= ? AND completed=true"
      query = "date_part('year', notes.created_at) = ? AND date_part('month', notes.created_at) >= ? AND  date_part('month', notes.created_at) <= ?" if task_category == :submitted
      where(
        query,
        Date.current.year,
        months[0],
        months[1],
      )
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Layout/LineLength

    def self.by_life_time_totals(task_category: completed)
      results = where('notes.created_at <= ?', Time.zone.now) if task_category.eql?(:submitted)
      results = where(completed: [false, nil]) if task_category.eql?(:outstanding)
      results = where(completed: true) if task_category.eql?(:completed)

      results
    end

    private

    def log_create_event
      user.generate_events('task_create', self)
    end

    def log_update_event
      update_changes = saved_changes.except('updated_at').first
      field = update_changes&.first
      value = update_changes&.last&.last

      return unless %w[completed completed_at due_date description body].include?(field)

      user.generate_events('task_update', self, { updated_field: field, new_value: value })
    end

    def log_completed_at
      return self.status = :not_started if !completed && status == 'completed'

      return status unless completed

      self.status = :completed
      self.completed_at = Time.current
    end
  end
  # rubocop:enable Metrics/ClassLength
end

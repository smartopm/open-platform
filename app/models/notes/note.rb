# frozen_string_literal: true

module Notes
  # Notes for the CRM portion of the app, attached to a user
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

    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :author, class_name: 'Users::User'
    belongs_to :form_user, class_name: 'Forms::FormUser', optional: true
    belongs_to :parent_note, class_name: 'Notes::Note', optional: true
    has_many :assignee_notes, dependent: :destroy
    has_many :assignees, through: :assignee_notes, source: :user
    has_many :note_comments, class_name: 'Comments::NoteComment', dependent: :destroy
    has_many :note_histories, dependent: :destroy
    has_many :sub_notes, class_name: 'Notes::Note',
                         foreign_key: 'parent_note_id',
                         dependent: :destroy,
                         inverse_of: :parent_note
    has_many_attached :documents, dependent: :destroy
    has_paper_trail

    before_save :log_completed_at, if: -> { completed_changed? && completed.eql?(true) }
    after_create :log_create_event
    after_update :log_update_event

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

    VALID_CATEGORY = %w[call email text message to_do form emergency template other].freeze
    validates :category, inclusion: { in: VALID_CATEGORY, allow_nil: true }
    validates :body, presence: true,
                     uniqueness: { scope: :community_id,
                                   case_sensitive: false }, if: -> { category.eql?('template') }
    alias sub_tasks sub_notes

    def assign_or_unassign_user(user_id)
      a_notes = assignee_notes.find_by(user_id: user_id)
      if a_notes.present?
        a_notes.delete
      else
        assign = assignee_notes.create!(user_id: user_id, note_id: self[:id])
        user.generate_events('task_assign', assign)
        assign
      end
    end

    def self.tasks_by_quarter(community_id)
      sql = "
        SELECT DATE_PART('year', completed_at) as yr, DATE_PART('quarter', completed_at) as qtr, \
        count(*) FROM notes WHERE completed = true AND community_id='#{community_id}'
        AND parent_note_id IS NULL GROUP BY yr, qtr;
      "
      ActiveRecord::Base.connection.exec_query(sql).rows
    end

    private

    def log_create_event
      user.generate_events('task_create', self)
    end

    def log_update_event
      update_changes = saved_changes.except('updated_at').first
      field = update_changes&.first
      value = update_changes&.last&.last
      user.generate_events('task_update', self, { updated_field: field, new_value: value })
    end

    def log_completed_at
      self.completed_at = Time.current
    end
  end
end

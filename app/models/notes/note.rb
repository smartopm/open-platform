# frozen_string_literal: true

module Notes
  # Notes for the CRM portion of the app, attached to a user
  class Note < ApplicationRecord
    include SearchCop
    include NoteHistoryRecordable

    search_scope :search do
      attributes :created_at, :completed, :due_date, :flagged, :category
    end

    search_scope :search_user do
      attributes :created_at, :completed, :due_date, :flagged, :category
      attributes user: 'user.name'
    end

    search_scope :search_assignee do
      attributes :created_at, :completed, :due_date, :flagged, :category
      attributes assignees: ['assignees.name']
    end

    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :author, class_name: 'Users::User'
    belongs_to :form_user, class_name: 'Forms::FormUser', optional: true
    has_many :assignee_notes, dependent: :destroy
    has_many :assignees, through: :assignee_notes, source: :user
    has_many :note_comments, class_name: 'Comments::NoteComment', dependent: :destroy
    has_many :note_histories, dependent: :destroy

    after_create :log_create_event
    after_update :log_update_event

    default_scope { order(created_at: :desc) }
    scope :by_due_date, ->(date) { where('due_date <= ?', date) }
    scope :by_completion, ->(is_complete) { where(completed: is_complete) }
    scope :by_category, ->(category) { where(category: category) }
    scope :for_site_manager, lambda { |current_user|
                               if current_user.user_type != 'admin'
                                 left_joins(:assignee_notes).where(
                                   arel_table[:author_id].eq(current_user.id)
                                      .or(Notes::AssigneeNote.arel_table[:user_id]
                                        .eq(current_user.id)),
                                 ).distinct
                               end
                             }

    VALID_CATEGORY = %w[call email text message to_do form other].freeze
    validates :category, inclusion: { in: VALID_CATEGORY, allow_nil: true }

    def assign_or_unassign_user(user_id)
      a_notes = assignee_notes.find_by(user_id: user_id)
      if a_notes.present?
        a_notes.delete
      else
        assignee_notes.create!(user_id: user_id, note_id: self[:id])
      end
    end

    private

    def log_create_event
      user.generate_events('task_create', self)
    end

    def log_update_event
      user.generate_events('task_update', self)
    end
  end
end

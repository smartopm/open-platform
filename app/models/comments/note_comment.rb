# frozen_string_literal: true

module Comments
  # Notes specific Comments
  class NoteComment < ApplicationRecord
    include NoteHistoryRecordable

    belongs_to :note, class_name: 'Notes::Note'
    belongs_to :user, class_name: 'Users::User'
    belongs_to :reply_from, class_name: 'Users::User', optional: true

    after_create :log_create_event
    after_update :log_update_event

    default_scope { where.not(status: 'deleted').order(created_at: :desc) }

    belongs_to :note_entity, polymorphic: true, optional: true

    def self.status_stats(current_user)
      stats = { sent: 0, received: 0, resolved: 0 }

      all.group_by(&:grouping_id).each do |grouping_id, comments|  
        status = comment_status(comments, current_user)
        stats[status.to_sym] += 1
      end

      stats
    end
  
    private

    def log_create_event
      user.generate_events('note_comment_create', self)
    end

    def log_update_event
      user.generate_events('note_comment_update', self)
    end

    def self.comment_status(grouped_comments, current_user)
      return 'resolved' if grouped_comments.all?(&:replied_at)
  
      if grouped_comments.first.user_id == current_user.id
        'sent'
      else
        'received'
      end 
    end
  end
end

# frozen_string_literal: true

require 'host_env'

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

    # rubocop:disable Layout/LineLength
    scope :tagged_document_comments, ->(tagged_document_id) { where('tagged_documents @> ?', "{#{tagged_document_id}}") }
    # rubocop:enable Layout/LineLength

    belongs_to :note_entity, polymorphic: true, optional: true

    class << self
      def status_stats(current_user)
        stats = { sent: 0, received: 0, resolved: 0 }

        all.group_by(&:grouping_id).each do |_grouping_id, comments|
          status = current_user.comment_status(comments)
          stats[status.to_sym] += 1
        end

        stats
      end
    end

    def new_body
      if process_comment? && tagged_documents?
        new_body = replace_document_mentions

        return new_body
      end

      body.truncate_words(5)
    end

    private

    def log_create_event
      user.generate_events('note_comment_create', self)
    end

    def log_update_event
      user.generate_events('note_comment_update', self)
    end

    def process_comment?
      note.form_user&.form&.process.present?
    end

    def tagged_documents?
      tagged_documents.present?
    end

    def replace_document_mentions
      process_id = note.form_user.form.process.id
      project_id = note_id
      base_url = HostEnv.base_url(note.community)
      # TODO: make path dynamic to accomodate comments on regular tasks
      path = "/processes/#{process_id}/projects/#{project_id}
                    ?tab=documents&project_id=#{project_id}&comment_id=#{id}"
      action_url = "https://#{base_url}#{path}"

      body.gsub(/\###(.*?)\###/) do |text|
        split_text = text.split('__')
        "<a href='#{action_url}&document_id=#{split_text[1]}'>#{split_text[2]}</a>"
      end
    end
  end
end

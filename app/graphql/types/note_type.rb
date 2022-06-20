# frozen_string_literal: true

require 'host_env'

module Types
  # NoteType
  class NoteType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :user_id, ID, null: false
    field :assigned_to, ID, null: true
    field :author, Types::UserType, null: false
    field :assignees, [Types::UserType], null: true
    field :assignee_notes, [Types::AssigneeNoteType], null: true
    field :body, String, null: true
    field :category, String, null: true
    field :description, String, null: true
    field :flagged, Boolean, null: true
    field :completed, Boolean, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :due_date, GraphQL::Types::ISO8601DateTime, null: true
    field :parent_note, Types::NoteType, null: true
    field :sub_tasks, [Types::NoteType], null: true
    field :documents, [GraphQL::Types::JSON], null: true
    field :attachments, [GraphQL::Types::JSON], null: true
    field :form_user_id, ID, null: true
    field :form_user, Types::FormUsersType, null: true
    field :progress, GraphQL::Types::JSON, null: true
    field :sub_tasks_count, Integer, null: true
    field :task_comments_count, Integer, null: true
    field :status, String, null: true
    field :submitted_by, Types::UserType, null: true
    field :message, Types::MessageType, null: true
    field :task_comment_reply, Boolean, null: true
    field :order, Integer, null: true
    field :note_list, Types::NoteListType, null: true

    # move this in a shareable place
    def host_url(type)
      base_url = HostEnv.base_url(object.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    def attachments
      return nil unless object.documents.attached?

      urls = []
      object.documents.where.not(status: 1).order(created_at: 'desc').each do |doc|
        file = {
          id: doc.id,
          filename: doc.blob.filename,
          url: host_url(doc),
          created_at: doc.created_at,
          task_id: doc.record_id,
          task_name: Notes::Note.find_by(id: doc.record_id)&.body,
          uploaded_by: ActiveStorage::Attachment.find_by(
            blob_id: doc.blob_id, record_type: 'Users::User',
          )&.record&.name,
          comment_count: object.note_comments.tagged_document_comments(doc.id).size,
        }
        urls << file
      end
      urls
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def sub_tasks_count
      object.sub_notes&.size
    end

    def task_comments_count
      object.note_comments&.size
    end

    def progress
      total = object.sub_notes.size
      complete = 0
      object.sub_notes.each do |note|
        complete += 1 if note.completed
      end
      progress_percentage = complete.fdiv(total).round(2) * 100
      { 'complete': complete, 'total': total, 'progress_percentage': progress_percentage }
    end

    def submitted_by
      object.form_user&.user
    end

    def task_comment_reply
      sub_task_ids = object.sub_tasks.pluck(:id)
      sub_sub_task_ids = Notes::Note.where(parent_note_id: sub_task_ids).pluck(:id)
      task_ids = [object.id].concat(sub_task_ids).concat(sub_sub_task_ids)

      Comments::NoteComment.exists?(reply_from: context[:current_user],
                                    note_id: task_ids,
                                    reply_required: true,
                                    replied_at: nil)
    end

    def message
      Notifications::Message.find_by(note_id: object.id)
    end
  end
end

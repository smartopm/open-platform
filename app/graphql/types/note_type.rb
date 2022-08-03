# frozen_string_literal: true

require 'host_env'

module Types
  # NoteType
  # rubocop:disable Metrics/ClassLength
  class NoteType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :user_id, ID, null: false
    field :author_id, ID, null: false
    field :assigned_to, ID, null: true
    field :author, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:author)
    field :assignees, [Types::UserType], null: true,
                                         resolve: Resolvers::BatchResolver.load(:assignees)
    field :assignee_notes, [Types::AssigneeNoteType],
          null: true,
          resolve: Resolvers::BatchResolver.load(:assignee_notes)
    field :body, String, null: true
    field :category, String, null: true
    field :description, String, null: true
    field :flagged, Boolean, null: true
    field :completed, Boolean, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :due_date, GraphQL::Types::ISO8601DateTime, null: true
    field :parent_note, Types::NoteType, null: true,
                                         resolve: Resolvers::BatchResolver.load(:parent_note)
    field :sub_tasks, [Types::NoteType], null: true,
                                         resolve: Resolvers::BatchResolver.load(:sub_notes)
    field :documents, [GraphQL::Types::JSON], null: true
    field :attachments, [GraphQL::Types::JSON], null: true
    field :form_user_id, ID, null: true
    field :form_user, Types::FormUsersType, null: true,
                                            resolve: Resolvers::BatchResolver.load(:form_user)
    field :progress, GraphQL::Types::JSON, null: true
    field :sub_tasks_count, Integer, null: true
    field :task_comments_count, Integer, null: true
    field :status, String, null: true
    field :submitted_by, Types::UserType, null: true
    field :message, Types::MessageType, null: true,
                                        resolve: Resolvers::BatchResolver.load(:message)
    field :task_comment_reply, Boolean, null: true
    field :order, Integer, null: true
    field :note_list, Types::NoteListType, null: true,
                                           resolve: Resolvers::BatchResolver.load(:note_list)

    # move this in a shareable place
    def host_url(type)
      base_url = HostEnv.base_url(context[:site_community])
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    def attachments
      args = { where: 'status <> 1', order: 'created_at DESC' }
      type = :has_many_attached
      attachment_load('Notes::Note', :documents, object.id, type: type, **args).then do |documents|
        documents_attached = []
        documents.compact.select do |doc|
          file = {
            id: doc.id,
            filename: doc.blob.filename,
            url: host_url(doc),
            created_at: doc.created_at,
            task_id: doc.record_id,
            task_name: object.body,
            uploaded_by: ActiveStorage::Attachment.find_by(
              blob_id: doc.blob_id, record_type: 'Users::User',
            )&.record&.name,
            comment_count: object.note_comments.tagged_document_comments(doc.id).size,
          }
          documents_attached << file
        end
        documents_attached.empty? ? nil : documents_attached
      end
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def sub_tasks_count
      batch_load(object, :sub_notes).then do |sub_notes|
        sub_notes&.size
      end
    end

    def task_comments_count
      batch_load(object, :note_comments).then do |note_comments|
        note_comments&.size
      end
    end

    def progress
      batch_load(object, :sub_notes).then do |sub_notes|
        total = sub_notes&.size
        complete = 0
        sub_notes.each do |note|
          complete += 1 if note.completed
        end
        progress_percentage = complete.fdiv(total).round(2) * 100
        { 'complete': complete, 'total': total, 'progress_percentage': progress_percentage }
      end
    end

    def submitted_by
      batch_load(object, :form_user).then do |form_user|
        batch_load(form_user, :user).then(&:presence) if form_user.present?
      end
    end

    def task_comment_reply
      batch_load(object, :sub_notes).then do |sub_tasks|
        sub_task_ids = sub_tasks.map(&:id)
        sub_sub_task_ids = Notes::Note.where(parent_note_id: sub_task_ids).pluck(:id)
        task_ids = [object.id].concat(sub_task_ids).concat(sub_sub_task_ids)
        Comments::NoteComment.exists?(reply_from: context[:current_user],
                                      note_id: task_ids,
                                      reply_required: true,
                                      replied_at: nil)
      end
    end
    # rubocop:enable Metrics/ClassLength
  end
end

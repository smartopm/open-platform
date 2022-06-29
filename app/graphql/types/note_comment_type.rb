# frozen_string_literal: true

require 'host_env'

module Types
  # NoteCommentType
  class NoteCommentType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :note, Types::NoteType, null: false
    field :user_id, ID, null: false
    field :note_id, ID, null: false
    field :body, String, null: true
    field :replied_at, GraphQL::Types::ISO8601DateTime, null: true
    field :reply_from, Types::UserType, null: true
    field :reply_required, Boolean, null: false
    field :grouping_id, ID, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :tagged_documents, [ID, { null: true }], null: true
    field :tagged_attachments, [GraphQL::Types::JSON], null: true

    def tagged_attachments
      return unless object.tagged_documents.present?

      urls = []
      ActiveStorage::Attachment.where(id: object.tagged_documents).each do |doc|
        file = {
          id: doc.id,
          url: host_url(doc),
        }
        urls << file
      end
      urls
    end

    def host_url(doc)
      base_url = HostEnv.base_url(object.note.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(doc)
      "https://#{base_url}#{path}"
    end
  end
end

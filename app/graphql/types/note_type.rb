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

    def host_url(type)
      base_url = HostEnv.base_url(object.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    def attachments
      return nil unless object.documents.attached?

      urls = []
      object.documents.each do |doc|
        file = { id: doc.id, filename: doc.blob.filename(), url: host_url(doc) }
        urls << file
      end
      urls
    end
  end
end

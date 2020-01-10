# frozen_string_literal: true

module Types
  # UserType
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :community, Types::CommunityType, null: false
    field :email, String, null: true
    field :name, String, null: false
    field :image_url, String, null: true
    field :user_type, String, null: true
    field :vehicle, String, null: true
    field :request_reason, String, null: true
    field :phone_number, String, null: true, visible: { roles: %i[admin security_guard], user: :id }
    field :request_note, String, null: true
    field :role_name, String, null: true
    field :state, String, null: true
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :last_activity_at, GraphQL::Types::ISO8601DateTime, null: true
    field :avatar_url, String, null: true
    field :document_url, String, null: true
    field :source, String, null: true
    field :stage, String, null: true
    field :owner_id, ID, null: true
    field :followup_at, GraphQL::Types::ISO8601DateTime, null: true
    field :notes, [Types::NoteType], null: true, visible: { roles: %i[admin], user: :id }

    def avatar_url
      return nil unless object.avatar.attached?

      Rails.application.routes.url_helpers
           .rails_blob_url(object.avatar)
    end

    def document_url
      return nil unless object.document.attached?

      Rails.application.routes.url_helpers
           .rails_blob_url(object.document)
    end
  end
end

# frozen_string_literal: true

module Types
  # UserLiteType
  class UserLiteType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :image_url, String, null: true
    field :user_type, String, null: true
    field :avatar_url, String, null: true

    def avatar_url
      return nil unless object.avatar.attached?

      Rails.application.routes.url_helpers
           .rails_blob_url(object.avatar)
    end
  end
end

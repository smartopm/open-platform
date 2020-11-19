# frozen_string_literal: true

module Types
  # CommentType
  class CommentType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :discussion_id, ID, null: false
    field :content, String, null: true
    field :image_url, String, null: true
    field :user, Types::UserType, null: false
    field :discussion, Types::DiscussionType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def image_url
      return nil unless object.image.attached?

      Rails.application.routes.url_helpers
           .rails_blob_url(object.image)
    end
  end
end

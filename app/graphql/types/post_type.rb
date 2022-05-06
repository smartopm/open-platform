# frozen_string_literal: true

module Types
  # Post
  class PostType < Types::BaseObject
    field :id, ID, null: false
    field :discussion, Types::DiscussionType, null: false
    field :user, Types::UserType, null: false
    field :content, String, null: false
    field :status, String, null: false
    field :image_urls, [String], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def image_urls
      return nil unless object.images.attached?

      base_url = HostEnv.base_url(object.community)

      object.images.where.not(status: 1).map do |image|
        path = Rails.application.routes.url_helpers.rails_blob_path(image)
        "https://#{base_url}#{path}"
      end
    end
  end
end

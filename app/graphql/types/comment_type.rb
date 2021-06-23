# frozen_string_literal: true

require 'host_env'

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
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false

    def image_url
      return nil unless object.image.attached?

      host_url(object.image)
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.user.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end
  end
end

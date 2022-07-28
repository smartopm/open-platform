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
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :discussion, Types::DiscussionType, null: true,
                                              resolve: Resolvers::BatchResolver.load(:discussion)
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def image_url
      attachment_load('Comments::Comment', :image, object.id).then do |image|
        host_url(image) if image.present?
      end
    end

    def host_url(type)
      base_url = HostEnv.base_url(context[:site_community])
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end
  end
end

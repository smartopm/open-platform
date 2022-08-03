# frozen_string_literal: true

module Types
  # Post
  class PostType < Types::BaseObject
    field :id, ID, null: false
    field :discussion, Types::DiscussionType, null: false,
                                              resolve: Resolvers::BatchResolver.load(:discussion)
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :content, String, null: false
    field :status, String, null: false
    field :accessibility, String, null: true
    field :image_urls, [String], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :discussion_id, ID, null: false

    def image_urls
      type = :has_many_attached
      args = { where: 'status <> 1' }
      attachment_load('Discussions::Post', :images, object.id, type: type, **args).then do |images|
        images_attached = []
        images.compact.select { |image| images_attached << host_url(image) }
        images_attached.empty? ? nil : images_attached
      end
    end

    def host_url(type)
      base_url = HostEnv.base_url(context[:site_community])
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    delegate :discussion_id, to: :object
  end
end

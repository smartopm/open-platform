# frozen_string_literal: true

require 'host_env'

module Types
  # InviteType
  class InviteType < Types::BaseObject
    field :id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :host_id, ID, null: true
    field :entry_time, Types::EntryTimeType, null: true,
                                             resolve: Resolvers::BatchResolver.load(:entry_time)
    field :guest, Types::UserType, null: true, resolve: Resolvers::BatchResolver.load(:guest)
    field :host, Types::UserType, null: true, resolve: Resolvers::BatchResolver.load(:host)
    field :thumbnail_url, String, null: true
    field :status, String, null: true

    def thumbnail_url
      batch_load(object&.guest, :request).then do |request|
        attachment_load('Logs::EntryRequest', :video, request&.id).then do |video|
          host_url(video.preview(resize_to_limit: [300, 300]).processed.image) if video.present?
        end
      end
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.guest.community)
      path = Rails.application.routes.url_helpers&.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end
  end
end

# frozen_string_literal: true

require 'host_env'

module Types
  # InviteType
  class InviteType < Types::BaseObject
    field :id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :host_id, ID, null: true
    field :entry_time, Types::EntryTimeType, null: true
    field :guest, Types::UserType, null: true
    field :host, Types::UserType, null: true
    field :thumbnail_url, String, null: true
    field :status, String, null: true

    def thumbnail_url
      video = object&.guest&.request&.video
      return nil unless video&.attached?

      host_url(video.preview(resize_to_limit: [300, 300]).processed.image)
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.guest.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end
  end
end

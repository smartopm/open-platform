# frozen_string_literal: true

require 'host_env'

module Types
  # ActivityLogType
  class EventLogType < Types::BaseObject
    field :id, ID, null: false
    field :acting_user_id, ID, null: true
    field :acting_user, Types::UserType, null: true
    field :ref_id, ID, null: true
    field :ref_type, String, null: true
    field :entry_request, Types::EntryRequestType, null: true
    field :user, Types::UserType, null: true
    field :community, Types::CommunityType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :subject, String, null: true
    field :data, GraphQL::Types::JSON, null: true
    field :sentence, String, null: true
    field :source, String, null: true
    field :image_urls, GraphQL::Types::JSON, null: true

    def sentence
      object.to_sentence
    end

    def entry_request
      return nil if object.ref_type != 'Logs::EntryRequest'

      object.ref
    end

    def user
      return nil if object.ref_type != 'Users::User'

      object.ref
    end

    def image_urls
      return nil unless object.images.attached?

      image_attached = []
      base_url = HostEnv.base_url(object.community)

      object.images.each do |img|
        path = Rails.application.routes.url_helpers.rails_blob_path(img)
        image_attached << "https://#{base_url}#{path}"
      end

      image_attached
    end
  end
end

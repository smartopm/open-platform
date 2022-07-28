# frozen_string_literal: true

require 'host_env'

module Types
  # EventLogType
  class EventLogType < Types::BaseObject
    field :id, ID, null: false
    field :acting_user_id, ID, null: true
    field :acting_user, Types::UserType, null: true,
                                         resolve: Resolvers::BatchResolver.load(:acting_user)
    field :ref_id, ID, null: true
    field :ref_type, String, null: true
    field :entry_request, Types::EntryRequestType, null: true
    field :user, Types::UserType, null: true
    field :community, Types::CommunityType, null: false,
                                            resolve: Resolvers::BatchResolver.load(:community)
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
      batch_load(object, :ref).then do |ref|
        ref if ref.instance_of?(Logs::EntryRequest)
      end
    end

    def user
      batch_load(object, :ref).then do |ref|
        ref if ref.instance_of?(Users::User)
      end
    end

    def image_urls
      type = :has_many_attached
      attachment_load('Logs::EventLog', :images, object.id, type: type).then do |images|
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
  end
end

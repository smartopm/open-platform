# frozen_string_literal: true

require 'host_env'

module Types
  # EntryRequestType
  class EntryRequestType < Types::BaseObject
    field :id, ID, null: false
    field :guest_id, ID, null: true
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :grantor, Types::UserType, null: true, resolve: Resolvers::BatchResolver.load(:grantor)
    field :guest, Types::UserType, null: true, resolve: Resolvers::BatchResolver.load(:guest)
    field :name, String, null: true
    field :email, String, null: true
    field :nrc, String, null: true
    field :phone_number, String, null: true
    field :vehicle_plate, String, null: true
    field :reason, String, null: true
    field :other_reason, String, null: true
    field :subject, String, null: true
    field :concern_flag, GraphQL::Types::Boolean, null: true
    field :granted_state, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :granted_at, GraphQL::Types::ISO8601DateTime, null: true
    field :source, String, null: true
    field :acknowledged, Boolean, null: true
    field :visitation_date, GraphQL::Types::ISO8601DateTime, null: true
    field :visit_end_date, GraphQL::Types::ISO8601DateTime, null: true
    field :start_time, String, null: true
    field :end_time, String, null: true
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: true
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: true
    field :company_name, String, null: true
    field :occurs_on, [String], null: true
    field :revoked_at, GraphQL::Types::ISO8601DateTime, null: true
    field :is_guest, Boolean, null: true
    field :entry_request_state, Integer, null: true
    field :active, Boolean, null: true
    field :revoked, Boolean, null: true
    field :video_url, String, null: true
    field :thumbnail_url, String, null: true
    field :image_urls, [String], null: true
    field :status, String, null: true
    field :exited_at, GraphQL::Types::ISO8601DateTime, null: true
    field :closest_entry_time, Types::EntryTimeType, null: true
    field :multiple_invites, Boolean, null: true

    def active
      object.active?
    end

    def revoked
      object.revoked?
    end

    def video_url
      attachment_load('Logs::EntryRequest', :video, object.id).then do |video|
        host_url(video) if video.present?
      end
    end

    def thumbnail_url
      attachment_load('Logs::EntryRequest', :video, object.id).then do |video|
        host_url(video.preview(resize_to_limit: [300, 300]).processed.image) if video.present?
      end
    end

    def image_urls
      type = :has_many_attached
      attachment_load('Logs::EntryRequest', :images, object.id, type: type).then do |images|
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

    def multiple_invites
      batch_load(object, :invites).then { |invites| invites.size > 1 }
    end
  end
end

# frozen_string_literal: true

require 'host_env'

module Types
  # EntryRequestType
  class EntryRequestType < Types::BaseObject
    field :id, ID, null: false
    field :guest_id, ID, null: true
    field :user, Types::UserType, null: false
    field :grantor, Types::UserType, null: true
    field :guest, Types::UserType, null: true
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
      return nil unless object.video.attached?

      host_url(object.video)
    end

    def thumbnail_url
      return nil unless object.video.attached?

      host_url(object.video.preview(resize_to_limit: [300, 300]).processed.image)
    end

    def image_urls
      return nil unless object.images.attached?

      images = []
      object.images.each do |img|
        images << host_url(img)
      end
      images
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.user.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    def multiple_invites
      object.invites.size > 1
    end
  end
end

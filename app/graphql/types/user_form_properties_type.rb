# frozen_string_literal: true

require 'host_env'

module Types
  # UserFormPropertiesType
  class UserFormPropertiesType < Types::BaseObject
    field :id, ID, null: false
    field :form_property, Types::FormPropertiesType, null: false
    field :form_user_id, Types::FormUsersType, null: false
    field :user, Types::UserType, null: false
    field :value, String, null: true
    field :image_url, String, null: true
    field :file_type, String, null: true
    field :file_name, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def image_url
      return nil unless object.image.attached?

      host_url(object.image)
    end

    def file_type
      object.file_blob&.content_type
    end

    def file_name
      object.file_blob&.filename
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.user.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end
  end
end

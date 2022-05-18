# frozen_string_literal: true

require 'host_env'

module Types
  # UserFormPropertiesType
  class UserFormPropertiesType < Types::BaseObject
    field :id, ID, null: false
    field :form_property, Types::FormPropertiesType, null: false
    field :form_user, Types::FormUsersType, null: false
    field :user, Types::UserType, null: false
    field :value, String, null: true
    field :image_url, String, null: true
    field :file_type, String, null: true
    field :file_name, String, null: true
    field :attachments, GraphQL::Types::JSON, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def image_url
      return nil unless object.image.attached?

      host_url(object.image)
    end

    def file_type
      object.image.blob&.content_type
    end

    def file_name
      object.image.blob&.filename
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.user.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    # rubocop:disable Metrics/MethodLength
    def attachments
      return nil unless object.attachments.attached?

      files = []
      object.attachments.each do |attachment|
        file = {
          id: attachment.id,
          file_name: attachment.blob.filename,
          file_type: attachment.blob.content_type,
          image_url: host_url(attachment),
        }
        files << file
      end
      files
    end
    # rubocop:enable Metrics/MethodLength
  end
end

# frozen_string_literal: true

require 'host_env'

module Types
  # UserFormPropertiesType
  class UserFormPropertiesType < Types::BaseObject
    field :id, ID, null: false
    field :form_property, Types::FormPropertiesType,
          null: false,
          resolve: Resolvers::BatchResolver.load(:form_property)
    field :form_user, Types::FormUsersType, null: false
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :value, String, null: true
    field :image_url, String, null: true
    field :file_type, String, null: true
    field :file_name, String, null: true
    field :attachments, GraphQL::Types::JSON, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def image_url
      attachment_load('Forms::UserFormProperty', :image, object.id).then do |image|
        host_url(image) if image.present?
      end
    end

    def file_type
      attachment_load('Forms::UserFormProperty', :image, object.id).then do |image|
        image.blob&.content_type if image.present?
      end
    end

    def file_name
      attachment_load('Forms::UserFormProperty', :image, object.id).then do |image|
        image.blob&.filename if image.present?
      end
    end

    def host_url(type)
      base_url = HostEnv.base_url(context[:site_community])
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    # rubocop:disable Metrics/MethodLength
    def attachments
      record_type = 'Forms::UserFormProperty'
      type = :has_many_attached
      attachment_load(record_type, :attachments, object.id, type: type).then do |attachments|
        attachments&.map do |attachment|
          next if attachment.nil?

          {
            id: attachment.id,
            file_name: attachment.blob.filename,
            file_type: attachment.blob.content_type,
            image_url: host_url(attachment),
          }
        end
      end
    end
    # rubocop:enable Metrics/MethodLength
  end
end

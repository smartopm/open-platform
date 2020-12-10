# frozen_string_literal: true

module Types
  # CommunityType
  class CommunityType < Types::BaseObject
    field :id, ID, null: false
    field :slug, String, null: false
    field :name, String, null: false
    field :logo_url, String, null: true
    field :timezone, String, null: true
    field :support_number, GraphQL::Types::JSON, null: true
    field :support_email, GraphQL::Types::JSON, null: true
    field :image_url, String, null: true

    def image_url
      return nil unless object.image.attached?

      "https://#{HostEnv.base_url(object)}#{Rails.application.routes.url_helpers.rails_blob_path(object.image)}"
    end
  end
end

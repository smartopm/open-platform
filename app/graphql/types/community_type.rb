# frozen_string_literal: true

require 'host_env'

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
    field :support_whatsapp, GraphQL::Types::JSON, null: true
    field :social_links, GraphQL::Types::JSON, null: true
    field :menu_items, GraphQL::Types::JSON, null: true
    field :image_url, String, null: true
    field :currency, String, null: true
    field :locale, String, null: true
    field :tagline, String, null: true
    field :language, String, null: true
    field :theme_colors, GraphQL::Types::JSON, null: true
    field :wp_link, String, null: true
    field :features, GraphQL::Types::JSON, null: true
    field :security_manager, String, null: true
    field :sub_administrator, Types::UserType, null: true
    field :banking_details, GraphQL::Types::JSON, null: true
    field :community_required_fields, GraphQL::Types::JSON, null: true

    def image_url
      return nil unless object.image.attached?

      base_url = HostEnv.base_url(object)
      path = Rails.application.routes.url_helpers.rails_blob_path(object.image)
      "https://#{base_url}#{path}"
    end
  end
end

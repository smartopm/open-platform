# frozen_string_literal: true

module Types
  # CommunityType
  class CommunityType < Types::BaseObject
    field :id, ID, null: false
    field :slug, String, null: false
    field :name, String, null: false
    field :logo_url, String, null: true
  end
end

# frozen_string_literal: true

module Types
  # AmenityType
  class AmenityType < Types::BaseObject
    field :name, String, null: true
    field :description, String, null: true
    field :location, String, null: true
    field :hours, String, null: true
    field :invitation_link, String, null: true
  end
end

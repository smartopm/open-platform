# frozen_string_literal: true

module Types
  # InvoiceType
  class InvoiceType < Types::BaseObject
    field :id, ID, null: false
    field :note, String, null: true
    field :status, String, null: true, visible: { roles: %i[admin], user: :id }
    field :amount, Float, null: true, visible: { roles: %i[admin], user: :id }
    field :description, String, null: true, visible: { roles: %i[admin], user: :id }
    field :community, Types::CommunityType, null: false
    field :land_parcel, Types::LandParcelType, null: false, visible: { roles: %i[admin], user: :id }
    field :user, Types::UserType, null: false
    field :due_date, GraphQL::Types::ISO8601DateTime, null: true, visible: { roles: %i[admin], user: :id }
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

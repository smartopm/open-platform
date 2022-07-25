# frozen_string_literal: true

module Types
  # Message Type
  class AccountType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :community, Types::CommunityType,
          null: false,
          resolve: Resolvers::BatchResolver.load(:community)
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :full_name, String, null: true
    field :address1, String, null: true
    field :address2, String, null: true
    field :city, String, null: true
    field :postal_code, String, null: true
    field :state_province, String, null: true
    field :country, String, null: true
    field :land_parcels, [Types::LandParcelType],
          null: true,
          resolve: Resolvers::BatchResolver.load(:land_parcels)
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

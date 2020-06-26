module Types
  class BusinessType < Types::BaseObject
     field :id, ID, null: false
    field :name, String, null: false
    field :verified, Boolean, null: true
    field :home_url, String, null: true
    field :category, String, null: true
    field :image_url, String, null: true
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end

# frozen_string_literal: true

module Types
  # FormType
  class FormPropertiesType < Types::BaseObject
    field :id, ID, null: false
    field :order, String, null: true
    field :field_name, String, null: true
    field :field_type, Integer, null: true
    field :short_desc, String, null: true
    field :long_desc, String, null: true
    field :required, Boolean, null: true
    field :admin_use, Boolean, null: true
    field :form, Types::FormType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

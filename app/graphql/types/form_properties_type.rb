# frozen_string_literal: true

module Types
  # FormType
  class FormPropertiesType < Types::BaseObject
    field :id, ID, null: false
    field :order, String, null: true
    field :field_name, String, null: false
    field :field_type, String, null: false
    field :field_value, GraphQL::Types::JSON, null: true
    field :short_desc, String, null: true
    field :long_desc, String, null: true
    field :required, Boolean, null: true
    field :admin_use, Boolean, null: true
    field :form, Types::FormType, null: false
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end

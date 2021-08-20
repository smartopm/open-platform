# frozen_string_literal: true

module Types
  # CategoryType
  class CategoryType < Types::BaseObject
    field :id, ID, null: false
    field :form_id, ID, null: false
    field :field_name, String, null: false
    field :order, Integer, null: false
    field :header_visible, Boolean, null: false
    field :general, Boolean, null: false
    field :description, String, null: true
    field :rendered_text, String, null: true
    field :form_properties, [Types::FormPropertiesType], null: true
    field :display_condition, GraphQL::Types::JSON, null: true
  end
end

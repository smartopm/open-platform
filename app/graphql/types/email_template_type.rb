# frozen_string_literal: true

module Types
  # EmailTemplate
  class EmailTemplateType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :subject, String, null: false
    field :description, String, null: false
    field :body, String, null: false
    field :community, Types::CommunityType, null: false
    field :variable_names, GraphQL::Types::JSON, null: false
    field :data, GraphQL::Types::JSON, null: true
    field :tag, String, null: true
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end

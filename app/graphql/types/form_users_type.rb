# frozen_string_literal: true

module Types
  # FormType
  class FormUsersType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :form, Types::FormType, null: true
    field :status, String, null: true
    field :status_updated_by, Types::UserType, null: true
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end

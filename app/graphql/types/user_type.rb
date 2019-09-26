# frozen_string_literal: true

module Types
  # UserType
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: true
    field :name, String, null: false
    field :members, [Types::MemberType], null: false
  end
end

# frozen_string_literal: true

module Types
  # ActionFieldType
  class ActionFieldType < Types::BaseObject
    field :name, String, null: false
    field :type, String, null: false
  end
end

# frozen_string_literal: true

require 'host_env'

module Types
  # PermissionType
  class PermissionType < Types::BaseObject
    field :id, ID, null: false
    field :module, String, null: true
    field :permissions, GraphQL::Types::JSON, null: true
  end
end

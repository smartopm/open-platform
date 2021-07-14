# frozen_string_literal: true

module Types
  # FormEntriesType
  class FormEntriesType < Types::BaseObject
    field :form_name, String, null: true
    field :form_users, [Types::FormUsersType], null: true
  end
end

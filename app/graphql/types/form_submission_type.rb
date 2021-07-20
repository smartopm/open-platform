# frozen_string_literal: true

module Types
  # FormSubmissionType
  class FormSubmissionType < Types::BaseObject
    field :field_name, String, null: true
    field :value, String, null: true
    field :id, ID, null: true
    #   field :form_users, [Types::FormUsersType], null: true
  end
end

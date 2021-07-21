# frozen_string_literal: true

module Types
  # FormSubmissionType
  class FormSubmissionType < Types::BaseObject
    field :id, ID, null: true
    field :value, String, null: true
    field :field_name, String, null: true
    field :field_type, String, null: true
  end
end

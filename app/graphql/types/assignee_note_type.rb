# frozen_string_literal: true

module Types
  # AssigneeNote
  class AssigneeNoteType < Types::BaseObject
    field :id, ID, null: false
    field :note_id, ID, null: false
    field :user_id, ID, null: false
    field :reminder_time, Types::Scalar::DateType, null: true
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end

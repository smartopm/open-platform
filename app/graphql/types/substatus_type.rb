# frozen_string_literal: true

module Types
    # SubStatusType
    class SubstatusType < Types::BaseObject
      field :applied, Integer, null: true
      field :architecture_reviewed, Integer, null: true
      field :approved, Integer, null: true
      field :contracted, Integer, null: true
      field :built, Integer, null: true
      field :in_construction, Integer, null: true
      field :interested, Integer, null: true
      field :moved_in, Integer, null: true
      field :paying, Integer, null: true
      field :ready_for_construction, Integer, null: true
    end
end
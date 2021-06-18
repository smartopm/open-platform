# frozen_string_literal: true

module Types
  # SubStatusType
  class SubstatusType < Types::BaseObject
    field :plots_fully_purchased, Integer, null: true
    field :eligible_to_start_construction, Integer, null: true
    field :floor_plan_purchased, Integer, null: true
    field :building_permit_approved, Integer, null: true
    field :construction_in_progress, Integer, null: true
    field :construction_completed, Integer, null: true
    field :construction_in_progress_self_build, Integer, null: true
    field :residents_count, Integer, null: true
  end
end

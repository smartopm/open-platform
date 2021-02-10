# frozen_string_literal: true

module Types
  # Substatus Distribution Report
  class SubstatusDistributionReportType < Types::BaseObject
    field :plots_fully_purchased, Types::SubstatusDistributionType, null: true
    field :eligible_to_start_construction, Types::SubstatusDistributionType, null: true
    field :floor_plan_purchased, Types::SubstatusDistributionType, null: true
    field :construction_approved, Types::SubstatusDistributionType, null: true
    field :construction_in_progress, Types::SubstatusDistributionType, null: true
    field :construction_completed, Types::SubstatusDistributionType, null: true
    field :census, Types::SubstatusDistributionType, null: true
    field :workers_on_site, Types::SubstatusDistributionType, null: true
  end
end

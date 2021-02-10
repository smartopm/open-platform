# frozen_string_literal: true

module Types
  # SubStatus Distribution Type
  class SubstatusDistributionType < Types::BaseObject
    field :between0to10Days, Integer, null: true
    field :between11to30Days, Integer, null: true
    field :between31to50Days, Integer, null: true
    field :between51to150Days, Integer, null: true
    field :over151Days, Integer, null: true
  end
end

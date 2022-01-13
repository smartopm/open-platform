# frozen_string_literal: true

module Types
    # TaskSummaryType
    class TaskSummaryType < Types::BaseObject
      field :first_quarter, Integer, null: true
      field :second_quarter, Integer, null: true
      field :third_quarter, Integer, null: true
      field :fourth_quarter, Integer, null: true
    end
  end

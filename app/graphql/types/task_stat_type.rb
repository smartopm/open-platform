# frozen_string_literal: true

module Types
  # TaskStatType
  class TaskStatType < Types::BaseObject
    field :tasks_open, Integer, null: true
    field :tasks_due_in_10_days, Integer, null: true
    field :tasks_due_in_30_days, Integer, null: true
    field :overdue_tasks, Integer, null: true
    field :completed_tasks, Integer, null: true
    field :total_calls_open, Integer, null: true
    field :total_forms_open, Integer, null: true
    field :tasks_open_and_overdue, Integer, null: true
    field :tasks_with_no_due_date, Integer, null: true
    field :my_open_tasks, Integer, null: true
  end
end

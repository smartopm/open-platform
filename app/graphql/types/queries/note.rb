# frozen_string_literal: true

# alias for tasks and todos

# Notes queries
module Types::Queries::Note
  extend ActiveSupport::Concern

  included do
    field :all_notes, [Types::NoteType], null: false do
      description 'Returns a list of all the notes'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :user_notes, [Types::NoteType], null: false do
      description 'Returns notes for the specific user'
      argument :id, String, required: true
    end

    field :flagged_notes, [Types::NoteType], null: false do
      description 'Returns a list of all the flagged notes, basically todos'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    field :my_tasks_count, Integer, null: false do
      description 'count of all tasks assigned to me'
    end

    field :task_stasts, Types::TaskStatType, null: false do
      description 'return stats related to tasks'
    end
  end

  def all_notes(offset: 0, limit: 50)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    context[:site_community].notes.includes(:user).limit(limit).offset(offset)
  end

  def user_notes(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    context[:site_community].notes.where(user_id: id)
  end

  def flagged_notes(offset: 0, limit: 50, query: nil)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    context[:site_community].notes.includes(:assignees, :author)
                            .eager_load(:assignee_notes, :assignees)
                            .where(flagged: true)
                            .search(query)
                            .order(completed: :desc, created_at: :desc)
                            .limit(limit).offset(offset)
  end

  def my_tasks_count
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    my_task
  end

  def task_stasts
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?
    # Total number of tasks open (active)
    #  Total number of tasks due in 10 days (active)
    #  Total number of tasks due in 30 days (active)
    #  Total overdue tasks
    #  Total calls open
    #  My open tasks
    #  Number of tasks open (active) overdue
    #  Completed tasks
    tasks = context[:site_community].notes.includes(:assignees, :author)
                                    .eager_load(:assignee_notes, :assignees)
                                    .where(flagged: true, completed: false)

    completed_tasks = context[:site_community].notes.includes(:assignees, :author)
                                    .eager_load(:assignee_notes, :assignees)
                                    .where(flagged: true, completed: true)
                                    .count
    date_in_10 =  10.days.from_now
    date_in_30 =  30.days.from_now
    tasks_open =  tasks.count
    tasks_due_in_10 = tasks.where("due_date <= ?", date_in_10).count
    tasks_due_in_30 = tasks.where("due_date <= ?", date_in_30).count
    tasks_with_no_due_date = tasks.where(due_date: nil).count
    overdue_tasks = tasks.where("due_date <= ?", Time.now).count
    tasks_open_and_overdue =  tasks.where(completed: false).where("due_date <= ?", Time.now).count
    my_open_tasks = my_task
    
    {
      tasks_open: tasks_open,
      tasks_due_in_10_days: tasks_due_in_10,
      tasks_due_in_30_days: tasks_due_in_30,
      overdue_tasks: overdue_tasks,
      completed_tasks: completed_tasks,
      tasks_open_and_overdue: tasks_open_and_overdue,
      tasks_with_no_due_date: tasks_with_no_due_date,
      my_open_tasks: my_open_tasks
    }
  end

  def my_task
    context[:current_user].tasks.where(completed: false).count
  end
end

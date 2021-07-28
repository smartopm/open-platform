# frozen_string_literal: true

# alias for tasks and todos

# Notes queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::Note
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  included do
    field :all_notes, [Types::NoteType], null: false do
      description 'Returns a list of all the notes'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :user_notes, [Types::NoteType], null: false do
      description 'Returns notes for the specific user'
      argument :id, GraphQL::Types::ID, required: true
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

    field :task_stats, Types::TaskStatType, null: false do
      description 'return stats related to tasks'
    end

    field :task, Types::NoteType, null: false do
      description 'return details for one task'
      argument :task_id, GraphQL::Types::ID, required: true
    end

    field :task_comments, [Types::NoteCommentType], null: false do
      description 'return comments for one task'
      argument :task_id, GraphQL::Types::ID, required: true
    end

    field :task_histories, [Types::NoteHistoryType], null: false do
      description 'return histories for one task'
      argument :task_id, GraphQL::Types::ID, required: true
    end

    field :user_tasks, [Types::NoteType], null: false do
      description 'Returns Takes for a specific user'
    end
  end
  # rubocop:enable Metrics/BlockLength

  def all_notes(offset: 0, limit: 50)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless current_user&.admin?

    context[:site_community].notes.where(flagged: false)
                            .includes(:user, :note_comments)
                            .limit(limit).offset(offset)
  end

  def user_notes(id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless current_user&.admin?

    context[:site_community].notes.where(user_id: id, flagged: false)
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def flagged_notes(offset: 0, limit: 50, query: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless valid_user?

    if query.present? && query.include?('assignees')
      context[:site_community].notes.search_assignee(query)
                              .by_allowed(current_user)
                              .includes(:assignees, :author, :user)
                              .eager_load(:assignee_notes, :assignees, :user)
                              .where(flagged: true)
                              .order(completed: :desc, created_at: :desc)
                              .limit(limit).offset(offset)
    elsif query.present? && query.include?('user')
      context[:site_community].notes.search_user(query)
                              .by_allowed(current_user)
                              .includes(:assignees, :author, :user)
                              .eager_load(:assignee_notes, :assignees, :user)
                              .where(flagged: true)
                              .order(completed: :desc, created_at: :desc)
                              .limit(limit).offset(offset)
    else
      context[:site_community].notes.includes(:assignees, :author, :user)
                              .by_allowed(current_user)
                              .eager_load(:assignee_notes, :assignees, :user)
                              .where(flagged: true)
                              .search(query)
                              .order(completed: :desc, created_at: :desc)
                              .limit(limit).offset(offset)
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def task(task_id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless valid_user?

    context[:site_community].notes.includes(:assignees, :author, :user)
                            .by_allowed(current_user)
                            .eager_load(:assignee_notes, :assignees, :user)
                            .where(flagged: true)
                            .find(task_id)
  end

  def task_comments(task_id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless valid_user?

    context[:site_community].notes.find(task_id).note_comments.eager_load(:user)
  end

  def task_histories(task_id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless valid_user?

    context[:site_community].notes.find(task_id)
                            .note_histories
                            .eager_load(:user)
                            .order(created_at: :desc)
  end

  def my_tasks_count
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless valid_user?

    my_task
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def task_stats
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless valid_user?

    tasks = context[:site_community].notes.by_allowed(current_user).where(flagged: true)

    {
      tasks_open: tasks.by_completion(false).count,
      tasks_due_in_10_days: tasks.by_completion(false).by_due_date(10.days.from_now).count,
      tasks_due_in_30_days: tasks.by_completion(false).by_due_date(30.days.from_now).count,
      overdue_tasks: tasks.by_completion(false).by_due_date(Time.zone.now).count,
      completed_tasks: tasks.by_completion(true).count,
      total_calls_open: tasks.by_completion(false).by_category('call').count,
      tasks_open_and_overdue: tasks.by_completion(false).by_due_date(Time.zone.now).count,
      tasks_with_no_due_date: tasks.where(due_date: nil).count,
      total_forms_open: tasks.by_completion(false).by_category('form').count,
      my_open_tasks: my_task,
    }
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def my_task
    context[:current_user].tasks.by_allowed(current_user).by_completion(false).count
  end

  def valid_user?
    user_types = %w[security_guard contractor custodian admin].freeze
    current_user.present? && user_types.include?(current_user.user_type)
  end

  def user_tasks
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless valid_user?

    context[:current_user].tasks.by_completion(false).by_allowed(current_user)
                          .where.not(due_date: nil)
                          .order(created_at: :desc)
                          .limit(5)
  end
end
# rubocop:enable Metrics/ModuleLength

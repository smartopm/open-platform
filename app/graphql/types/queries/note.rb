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

    field :task_sub_tasks, [Types::NoteType], null: false do
      description 'Returns a list subtasks for one task'
      argument :task_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
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
  def flagged_notes(offset: 0, limit: 50, query: nil)
    unless current_user&.site_manager? ||
           ::Policy::ApplicationPolicy.new(
             current_user, nil
           ).permission?(
             module: :note, permission: :can_fetch_flagged_notes,
           )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    notes = flagged_notes_query(query)

    notes
      .for_site_manager(current_user)
      .limit(limit).offset(offset)
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable  Metrics/MethodLength
  def task(task_id:)
    unless current_user&.site_manager? ||
           ::Policy::ApplicationPolicy.new(
             current_user, nil
           ).permission?(
             module: :note, permission: :can_fetch_task_by_id,
           )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end
    context[:site_community].notes.includes(:assignees, :author, :user)
                            .for_site_manager(current_user)
                            .eager_load(:assignee_notes, :assignees, :user)
                            .where(flagged: true)
                            .find(task_id)
  end
  # rubocop:enable  Metrics/MethodLength

  def task_comments(task_id:)
    unless current_user&.site_manager? ||
           ::Policy::ApplicationPolicy.new(
             current_user, nil
           ).permission?(
             module: :note, permission: :can_fetch_task_comments,
           )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end
    context[:site_community].notes.find(task_id).note_comments.eager_load(:user)
  end

  # rubocop:disable Metrics/MethodLength
  def task_histories(task_id:)
    unless current_user&.site_manager? ||
           ::Policy::ApplicationPolicy.new(
             current_user, nil
           ).permission?(
             module: :note, permission: :can_fetch_task_histories,
           )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community].notes.find(task_id)
                            .note_histories
                            .eager_load(:user)
                            .order(created_at: :desc)
  end

  # rubocop:enable Metrics/MethodLength
  def my_tasks_count
    unless current_user&.site_manager? ||
           ::Policy::ApplicationPolicy.new(
             current_user, nil
           ).permission?(
             module: :note, permission: :can_get_task_count,
           )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    my_task
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def task_stats
    unless current_user&.site_manager? ||
           ::Policy::ApplicationPolicy.new(
             current_user, nil
           ).permission?(
             module: :note, permission: :can_get_task_stats,
           )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    tasks = context[:site_community].notes.for_site_manager(current_user).where(flagged: true)

    {
      tasks_open: tasks.by_completion(false).count,
      tasks_due_in_10_days: tasks.by_completion(false).by_due_date(10.days.from_now)
                                 .where('due_date >= ?', Time.zone.now).count,
      tasks_due_in_30_days: tasks.by_completion(false).by_due_date(30.days.from_now)
                                 .where('due_date >= ?', Time.zone.now).count,
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
    context[:current_user].tasks.by_completion(false).count
  end

  # rubocop:disable Metrics/MethodLength
  def user_tasks
    unless current_user&.site_manager? ||
           ::Policy::ApplicationPolicy.new(
             current_user, nil
           ).permission?(
             module: :note, permission: :can_get_own_tasks,
           )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:current_user].tasks.by_completion(false)
                          .where.not(due_date: nil)
                          .order(created_at: :desc)
                          .limit(5)
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def task_sub_tasks(task_id:, limit: 3, offset: 0)
    unless current_user&.site_manager? ||
           ::Policy::ApplicationPolicy.new(
             current_user, nil
           ).permission?(
             module: :note, permission: :can_fetch_task_by_id,
           )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community].notes.find(task_id)
                            .sub_tasks
                            .includes(:sub_notes)
                            .eager_load(:assignee_notes, :assignees, :author, :user)
                            .order(created_at: :asc)
                            .limit(limit).offset(offset)
                            .with_attached_documents
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  private

  # rubocop:disable Metrics/MethodLength
  def flagged_notes_query(query)
    search = search_method(query)

    notes = if query&.include?('due_date:nil')
              tasks_query.where(due_date: nil)
            else
              tasks_query.send(search, query)
            end

    if search == 'search_assignee'
      notes = notes
              .includes(
                parent_note: [
                  { user: [:avatar_attachment] },
                  :author,
                  :sub_notes,
                  :assignees,
                  :assignee_notes,
                  :documents_attachments,
                ],
              )
    end
    notes
  end
  # rubocop:enable Metrics/MethodLength

  def tasks_query
    context[:site_community]
      .notes
      .includes({ user: [:avatar_attachment] }, :author, :sub_notes, :assignees, :assignee_notes)
      .includes(:parent_note)
      .where(flagged: true, parent_note_id: nil) # Return only parent tasks
      .where.not(category: 'template')
      .order(completed: :desc, created_at: :desc)
      .with_attached_documents
  end

  def search_method(query)
    if query&.include?('assignees')
      'search_assignee'
    elsif query&.include?('user')
      'search_user'
    else
      'search'
    end
  end
end
# rubocop:enable Metrics/ModuleLength

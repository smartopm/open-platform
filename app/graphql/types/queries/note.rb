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

    field :project_open_tasks, [Types::NoteType], null: false do
      description "return details for project's open tasks"
      argument :task_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :task_comments, [Types::NoteCommentType], null: false do
      description 'return comments for one task'
      argument :task_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :project_comments, [Types::NoteCommentType], null: false do
      description 'return comments for a project'
      argument :task_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
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

    field :processes, [Types::NoteType], null: false do
      description 'Returns a list of processes'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    field :client_assigned_projects, [Types::NoteType], null: false do
      description 'Returns assigned projects for the client'
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :projects, [Types::NoteType], null: false do
      description 'Returns a list of projects under a process'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :step, String, required: false
      argument :completed_per_quarter, String, required: false
      argument :submitted_per_quarter, String, required: false
      argument :life_time_category, String, required: false
      argument :process_type, String, required: false
      argument :replies_requested_status, String, required: false
    end

    field :project_stages, [GraphQL::Types::JSON], null: false do
      description 'Returns an aggregated list of projects'
    end

    field :tasks_by_quarter, GraphQL::Types::JSON, null: false do
      description 'Completed tasks by quarter'
      argument :process_type, String, required: false
    end

    field :project, Types::NoteType, null: false do
      description 'return details for one project'
      argument :form_user_id, GraphQL::Types::ID, required: true
    end

    field :task_lists, [Types::NoteType], null: false do
      description 'Returns a list of task lists in a community'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :task_list, Types::NoteType, null: false do
      description 'return details for one task list'
      argument :task_id, GraphQL::Types::ID, required: true
    end

    field :reply_comment_stats, Types::NoteCommentStatType, null: false do
      description 'Returns stats of reply-requested comments for a process'
      argument :process_type, String, required: false
    end
  end
  # rubocop:enable Metrics/BlockLength

  def all_notes(offset: 0, limit: 50)
    unless permitted?(module: :note, permission: :can_fetch_all_notes)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community].notes.where(flagged: false)
                            .includes(:user)
                            .limit(limit).offset(offset)
  end

  def user_notes(id:)
    unless permitted?(module: :note, permission: :can_fetch_user_notes)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community].notes.where(user_id: id, flagged: false)
  end

  def flagged_notes(offset: 0, limit: 50, query: nil)
    unless permitted?(module: :note, permission: :can_fetch_flagged_notes)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    notes = flagged_notes_query(query)

    notes
      .for_site_manager(current_user)
      .limit(limit).offset(offset)
  end

  def task(task_id:)
    # Disable loading tasks by assignee to allow viewing of subtasks
    unless permitted?(module: :note, permission: :can_fetch_task_by_id)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end
    context[:site_community].notes.includes(:assignees, :author, :user)
                            .eager_load(:assignee_notes, :assignees, :user)
                            .where(flagged: true)
                            .find(task_id)
  end

  def task_comments(task_id:, offset: 0, limit: nil)
    unless permitted?(module: :note, permission: :can_fetch_task_comments)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community]
      .notes.find(task_id)
      .note_comments
      .eager_load(:user)
      .limit(limit).offset(offset)
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def project_comments(task_id:, offset: 0, limit: nil)
    unless permitted?(module: :note, permission: :can_fetch_task_comments)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    parent_task = context[:site_community].notes.find(task_id)
    task_ids = project_task_ids(parent_task: parent_task)

    if permitted?(module: :note, permission: :can_fetch_tagged_comments)
      tagged_comments = project_tagged_comments(task_ids)
      return tagged_comments.limit(limit).offset(offset)
    end

    if permitted?(module: :note, permission: :can_fetch_comments_on_assigned_tasks)
      tagged_comments = project_assigned_tasks_comments(task_ids)
      return tagged_comments.limit(limit).offset(offset)
    end

    # Admins will see all comments in the project that require reply
    Comments::NoteComment
      .where(
        note_id: task_ids,
        reply_required: true,
        replied_at: nil,
      )
      .limit(limit).offset(offset)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def task_histories(task_id:)
    unless permitted?(module: :note, permission: :can_fetch_task_histories)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community].notes.find(task_id)
                            .note_histories
                            .eager_load(:user)
                            .order(created_at: :desc)
  end

  def my_tasks_count
    unless permitted?(module: :note, permission: :can_get_task_count)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    my_task
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def task_stats
    unless permitted?(module: :note, permission: :can_get_task_stats)
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

  def reply_comment_stats(process_type: 'drc')
    unless permitted?(module: :note, permission: :can_get_comment_stats)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    current_user = context[:current_user]
    task_ids = []
    projects_query(process_type).each do |project|
      task_ids.concat(project_task_ids(parent_task: project))
    end

    user_replied_requested_comments(task_ids).status_stats(current_user)
  end

  def user_tasks
    unless permitted?(module: :note, permission: :can_get_own_tasks)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:current_user].tasks.by_completion(false)
                          .where.not(due_date: nil)
                          .order(created_at: :desc)
                          .limit(5)
  end

  # rubocop:disable Metrics/MethodLength
  def task_sub_tasks(task_id:, limit: 3, offset: 0)
    unless permitted?(module: :note, permission: :can_fetch_task_by_id)
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
  # rubocop:enable Metrics/MethodLength

  def processes(offset: 0, limit: 50, query: nil)
    unless permitted?(module: :note, permission: :can_fetch_flagged_notes)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    notes = flagged_notes_query(query)

    notes
      .where(category: 'form')
      .for_site_manager(current_user)
      .limit(limit).offset(offset)
  end

  def user_replied_requested_comments(task_ids)
    Comments::NoteComment.where(
      note_id: task_ids,
      reply_required: true,
      user_id: context[:current_user],
    ).or(Comments::NoteComment.where(
           note_id: task_ids,
           reply_required: true,
           reply_from_id: context[:current_user],
         ))
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  def projects(process_type: 'drc', **vals)
    # This query only shows projects under the DRC process for now
    # Our notes does not allow us to categorise processes by type
    # This should be implemented in the future to allow us to fetch...
    # projects by the process they belong to
    unless permitted?(module: :note, permission: :can_fetch_flagged_notes)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end
    completed_per_quarter = vals[:completed_per_quarter]
    submitted_per_quarter = vals[:submitted_per_quarter]
    life_time_category = vals[:life_time_category]
    replies_requested_status = vals[:replies_requested_status]
    # TODO(Nurudeen): Make completed field defaults to false and not NIL
    results = projects_query(process_type)

    results = results.where(completed: [false, nil], current_step_body: vals[:step]) if vals[:step]

    if completed_per_quarter
      results = projects_query(process_type).by_quarter(completed_per_quarter)
    end

    if submitted_per_quarter
      results = projects_query(process_type).by_quarter(submitted_per_quarter,
                                                        task_category: :submitted)
    end

    if valid_life_time_category?(life_time_category)
      results = projects_query(process_type)
                .by_life_time_totals(task_category: life_time_category.to_sym)
    end

    if replies_requested_status
      results = []
      projects_query(process_type).each do |project|
        task_ids = project_task_ids(parent_task: project)
        note_comments = user_replied_requested_comments(task_ids)

        note_comments.group_by(&:grouping_id).each do |_grouping_id, comments|
          status = context[:current_user].comment_status(comments)
          results << project if status == replies_requested_status
        end
      end

      return results
    end

    results.limit(vals[:limit]).offset(vals[:offset])
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity

  def project_stages
    # This will get the total project steps for each DRC process
    # To be modified to allow for other types of processes
    drc_projects = projects

    context[:site_community]
      .notes
      .unscoped
      .where(parent_note_id: drc_projects.pluck(:id), completed: true)
      .group(:body).count
  end

  # rubocop:disable Metrics/MethodLength
  def project_open_tasks(task_id:, limit: 3, offset: 0)
    authorize
    sub_task_ids = context[:site_community].notes.find(task_id).sub_tasks.pluck(:id)
    context[:site_community].notes
                            .includes(
                              :parent_note,
                              :sub_notes,
                              :assignee_notes,
                              :assignees,
                              :author,
                              :user,
                            )
                            .where(id: sub_task_ids, completed: false)
                            .for_site_manager(current_user)
                            .with_attached_documents
                            .or(context[:site_community].notes
                              .includes(
                                :parent_note,
                                :sub_notes,
                                :assignee_notes,
                                :assignees,
                                :author,
                                :user,
                              )
                              .where(parent_note_id: sub_task_ids, completed: false)
                              .for_site_manager(current_user)
                              .with_attached_documents)
                            .order(created_at: :asc)
                            .limit(limit).offset(offset)
  end

  def client_assigned_projects(offset: 0, limit: 50)
    unless permitted?(module: :note, permission: :can_fetch_flagged_notes)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    assigned_tasks = current_user
                     .tasks
                     .includes(:parent_note)
    # Get the top level parent for each assigned task
    projects_assigned = []
    assigned_tasks.each do |task|
      if task.parent_note_id.present?
        parent = task.parent_note.parent_note.presence || task.parent_note
        projects_assigned << parent
      else
        projects_assigned << task
      end
    end

    drc_form_users = context[:site_community].drc_form_users.pluck(:id)
    context[:site_community]
      .notes
      .includes(:sub_notes, :assignees, :assignee_notes, :documents_attachments)
      .where(id: projects_assigned.pluck(:id), form_user_id: drc_form_users)
      .offset(offset).limit(limit)
  end
  # rubocop:enable Metrics/AbcSize

  def task_lists(limit: 50, offset: 0)
    unless permitted?(module: :note, permission: :can_view_task_lists)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community]
      .notes
      .includes(:sub_notes, :assignees, :assignee_notes, :documents_attachments)
      .where(category: 'task_list')
      .offset(offset).limit(limit)
  end

  def task_list(task_id:)
    unless permitted?(module: :note, permission: :can_view_task_lists)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community]
      .notes
      .where(category: 'task_list')
      .find(task_id)
  end

  def tasks_by_quarter(process_type: 'drc')
    community_id = context[:site_community].id

    {
      completed: Notes::Note.tasks_by_quarter(community_id, process_type),
      submitted: Notes::Note.tasks_by_quarter(community_id, process_type,
                                              task_category: :submitted),
    }
  end

  def project(form_user_id:)
    unless permitted?(module: :note, permission: :can_fetch_task_by_id)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    project = context[:site_community]
              .notes
              .find_by(form_user_id: form_user_id, category: 'form')

    raise ActiveRecord::RecordNotFound if project.blank?

    project
  end

  private

  def flagged_notes_query(query)
    search = search_method(query)

    if query&.include?('due_date:nil')
      tasks_query.where(due_date: nil)
    else
      tasks_query.send(search, query)
    end
  end

  def tasks_query
    context[:site_community]
      .notes
      .includes(
        :sub_notes,
        :assignees,
        :assignee_notes,
        :note_comments,
        :form_user,
        { user: %i[avatar_attachment] },
      )
      .where(flagged: true, parent_note_id: nil) # Return only parent tasks
      .where.not(category: %w[template task_list])
      .order(completed: :desc, created_at: :desc)
      .with_attached_documents
  end
  # rubocop:enable Metrics/MethodLength

  def search_method(query)
    if query&.include?('assignees')
      'search_assignee'
    elsif query&.include?('user')
      'search_user'
    else
      'search'
    end
  end

  # rubocop:disable Metrics/MethodLength
  def projects_query(process_type)
    process_form_users = context[:site_community].process_form_users(process_type)&.pluck(:id)

    context[:site_community]
      .notes
      .includes(
        :sub_notes,
        { assignees: %i[avatar_attachment community] },
        :assignee_notes,
        :documents_attachments,
        { form_user: %i[user] },
      )
      .where(parent_note_id: nil, form_user_id: process_form_users)
      .for_site_manager(current_user)
  end
  # rubocop:enable Metrics/MethodLength

  def authorize
    return if permitted?(module: :note, permission: :can_fetch_task_by_id)

    raise GraphQL::ExecutionError,
          I18n.t('errors.unauthorized')
  end

  def project_task_ids(parent_task:)
    sub_task_ids = parent_task.sub_tasks.pluck(:id)
    sub_sub_task_ids = Notes::Note.where(parent_note_id: sub_task_ids).pluck(:id)

    [parent_task.id].concat(sub_task_ids).concat(sub_sub_task_ids)
  end

  def project_tagged_comments(task_ids)
    Comments::NoteComment.where(
      reply_from: context[:current_user],
      note_id: task_ids,
      reply_required: true,
      replied_at: nil,
    )
  end

  def project_assigned_tasks_comments(task_ids)
    # Assigned tasks in the project that require current user's reply
    assigned_tasks = current_user
                     .tasks
                     .includes(:parent_note)
                     .where(id: task_ids)

    Comments::NoteComment.where(
      note_id: assigned_tasks.pluck(:id),
      reply_required: true,
      replied_at: nil,
    )
  end

  def valid_life_time_category?(category)
    %w[completed submitted outstanding].include?(category)
  end
end
# rubocop:enable Metrics/ModuleLength

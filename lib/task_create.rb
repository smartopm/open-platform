# frozen_string_literal: true

# class helper to handle creating task from Action Flow
# rubocop: disable Metrics/ClassLength
class TaskCreate
  class UninitializedError < StandardError; end
  class TaskCreateError < StandardError; end

  # public interface used by task action in Action Flow
  def self.new_from_action(data = {})
    return if data[:author_id].blank? || data[:body].blank?

    community = community(data[:author_id])

    return if community.nil?

    ActiveRecord::Base.transaction do
      note = create_task(community, data)
      assign_users_to_task(note, data[:assignees])
      note
    rescue StandardError => e
      Rails.logger.warn e.full_message
    end
  end

  # rubocop:disable Metrics/MethodLength
  # Creates autogenerated task for Action Flow event.
  #
  # @param community [Community]
  # @param data [Hash]
  # @option data [String] body
  # @option data [String] category
  # @option data [String] description
  # @option data [String] User#id (user_id)
  # @option data [ActiveSupport::TimeWithZone ] Due date
  # @option data [String] User#id (author_id)
  #
  # @return [void]
  def self.create_task(community, data)
    community.notes.create(
      body: data[:body],
      category: data[:category],
      description: data[:description],
      form_user_id: data[:form_user_id],
      flagged: true,
      user_id: data[:user_id] || data[:author_id],
      due_date: data[:due_date],
      author_id: data[:author_id],
      autogenerated: true,
      completed: false,
    )
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.new_from_template(data, community)
    return if community.blank? || data[:author_id].blank? || data[:body].blank?

    templates = task_templates(community)
    return TaskCreate.new_from_action(data) if templates.blank?

    ActiveRecord::Base.transaction do
      parent_task_params = {
        body: data[:body],
        category: 'form',
        parent_note_id: nil,
        autogenerated: true,
        form_user_id: data[:form_user_id],
        flagged: true,
        completed: false,
        user_id: data[:user_id],
        author_id: data[:author_id],
      }

      parent_task = community.notes.create!(parent_task_params)
      create_sub_tasks_from_template(community, templates, parent_task)
    rescue StandardError => e
      Rails.logger.warn e.full_message
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.new_from_process(data, process)
    return if data[:author_id].blank? || data[:body].blank?

    steps = note_list_steps(process)
    ActiveRecord::Base.transaction do
      parent_task_params = {
        body: data[:body],
        category: 'form',
        parent_note_id: nil,
        autogenerated: true,
        form_user_id: data[:form_user_id],
        flagged: true,
        completed: false,
        user_id: data[:user_id],
        author_id: data[:author_id],
      }

      parent_task = process.community.notes.create!(parent_task_params)
      create_sub_tasks_from_note_list(process, steps, parent_task[:id], parent_task[:form_user_id])
    rescue StandardError => e
      Rails.logger.warn e.full_message
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def self.note_list_steps(process)
    # When creating a task list, we create a parent task and steps to it
    # To get the steps, we need to get this parent's sub_tasks
    process.note_list.notes.find_by(parent_note_id: nil, category: 'task_list').sub_tasks
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.create_sub_tasks_from_note_list(process, steps, parent_task_id, form_user_id)
    # rubocop:disable Metrics/BlockLength
    steps.each do |step|
      cloned_sub_step = process.community.notes.create!(
        body: step[:body],
        description: step[:description],
        category: 'to_do',
        flagged: true,
        completed: false,
        user_id: step[:user_id],
        author_id: step[:author_id],
        parent_note_id: parent_task_id,
        form_user_id: form_user_id,
        autogenerated: true,
        order: step[:order],
      )
      step.sub_tasks.each do |sub_step|
        cloned_sub_sub_step = process.community.notes.create!(
          body: sub_step[:body],
          description: sub_step[:description],
          category: 'to_do',
          flagged: true,
          user_id: sub_step[:user_id],
          author_id: sub_step[:author_id],
          completed: false,
          parent_note_id: cloned_sub_step[:id],
          autogenerated: true,
          form_user_id: form_user_id,
          order: sub_step[:order],
        )

        assign_task_to_user_from_template_task(sub_step, cloned_sub_sub_step)
      end
    end
    # rubocop:enable Metrics/BlockLength
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def self.assign_users_to_task(note, assignees)
    assignees.present? && assignees.split(',').each do |assignee|
      note.assign_or_unassign_user(assignee)
    end
  end

  def self.community(user_id)
    user = Users::User.where(id: user_id).includes(:community).first

    return user.community if user

    nil
  end

  def self.task_templates(community)
    community.notes
             .where(category: 'template', parent_note_id: nil)
            &.includes(:sub_notes)
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.create_sub_tasks_from_template(community, templates, parent_task)
    # rubocop:disable Metrics/BlockLength
    templates.reverse.each do |t|
      sub_task = community.notes.create!(
        body: t[:body],
        description: t[:description],
        category: 'to_do',
        flagged: true,
        completed: false,
        user_id: t[:user_id],
        author_id: t[:author_id],
        parent_note_id: parent_task[:id],
        form_user_id: parent_task[:form_user_id],
        autogenerated: true,
        order: t[:order],
      )
      t.sub_tasks.each do |template_sub_task|
        sub_sub_task = community.notes.create!(
          body: template_sub_task[:body],
          description: template_sub_task[:description],
          category: 'to_do',
          flagged: true,
          user_id: template_sub_task[:user_id],
          author_id: template_sub_task[:author_id],
          completed: false,
          parent_note_id: sub_task[:id],
          autogenerated: true,
          form_user_id: parent_task[:form_user_id],
          order: template_sub_task[:order],
        )

        assign_task_to_user_from_template_task(template_sub_task, sub_sub_task)
      end
    end
    # rubocop:enable Metrics/BlockLength
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def self.assign_task_to_user_from_template_task(template_task, new_task)
    return if template_task.blank? || new_task.blank?

    template_assignees = template_task.assignee_notes
    return if template_assignees.blank?

    template_assignees.each do |assignee|
      new_task.assign_or_unassign_user(assignee[:user_id])
    end
  end
end
# rubocop: enable Metrics/ClassLength

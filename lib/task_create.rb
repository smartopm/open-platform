# frozen_string_literal: true

# class helper to handle creating task from Action Flow
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

    # fail gracefully
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
        category: 'to_do',
        parent_note_id: nil,
        autogenerated: true,
        form_user_id: data[:form_user_id],
        flagged: true,
        completed: false,
        user_id: data[:user_id],
        author_id: data[:author_id],
        # assignees: user.community.sub_administrator_id,
      }

      parent_task = community.notes.create!(parent_task_params)
      create_sub_tasks_from_template(community, templates, parent_task)
    rescue StandardError => e
      Rails.logger.warn e.full_message
    end
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
        autogenerated: true,
      )
      t.sub_tasks.each do |s_t|
        community.notes.create!(
          body: s_t[:body],
          description: s_t[:description],
          category: 'to_do',
          flagged: true,
          user_id: s_t[:user_id],
          author_id: s_t[:author_id],
          completed: false,
          parent_note_id: sub_task[:id],
          autogenerated: true,
        )
      end
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
end

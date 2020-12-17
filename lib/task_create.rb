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

  def self.create_task(community, data)
    community.notes.create(
      body: data[:body],
      category: data[:category],
      description: data[:description],
      flagged: true,
      user_id: data[:user_id] || data[:author_id],
      due_date: data[:due_date],
      author_id: data[:author_id],
    )
  end

  def self.assign_users_to_task(note, assignees)
    assignees.present? && assignees.split(',').each do |assignee|
      note.assign_or_unassign_user(assignee)
    end
  end

  def self.community(user_id)
    user = User.where(id: user_id).includes(:community).first

    return user.community if user

    nil
  end
end

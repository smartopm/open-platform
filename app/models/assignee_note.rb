# frozen_string_literal: true

# AssigneeNote
class AssigneeNote < ApplicationRecord
  belongs_to :user
  belongs_to :note

  before_create :notify_user
  before_update :notify_user, if: proc { changed_attributes.include?(:user_id) }

  private

  def notify_user
    EmailMsg.send_task_notification(user.email, note_id)
  end
end

# frozen_string_literal: true

# AssigneeNote
class AssigneeNote < ApplicationRecord
  belongs_to :user
  belongs_to :note

  after_create :notify_user
  after_update :notify_user, if: proc { saved_change_to_user_id? }

  private

  def notify_user
    EmailMsg.send_task_notification(user.email, note_id)
  end
end

# frozen_string_literal: true

# AssigneeNote
class AssigneeNote < ApplicationRecord
  belongs_to :user
  belongs_to :note

  after_create :notify_user
  after_update :notify_user, if: proc { saved_change_to_user_id? }

  NOTIFICATION_TEMPLATE = 'd-1fe3bcf8035c4c1c9737e147c4eb31c6'

  private

  def notify_user
    EmailMsg.send_mail(user.email, NOTIFICATION_TEMPLATE, mail_data)
  end

  def mail_data
    { "url": "#{ENV['HOST']}/todo" }
  end
end

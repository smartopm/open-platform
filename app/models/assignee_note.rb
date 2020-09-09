# frozen_string_literal: true

# AssigneeNote
class AssigneeNote < ApplicationRecord
  belongs_to :user
  belongs_to :note

  after_create :notify_user
  after_update :notify_user, if: proc { saved_change_to_user_id? }

  private

  def notify_user
    EmailMsg.send_mail(user.email, community_template, mail_data)
  end

  def community_template
    user.community.templates['notification_template_id']
  end

  def mail_data
    { "url": "#{ENV['HOST']}/todo" }
  end
end

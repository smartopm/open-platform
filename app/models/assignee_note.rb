# frozen_string_literal: true

# AssigneeNote
class AssigneeNote < ApplicationRecord
  belongs_to :user
  belongs_to :note

  after_create :notify_user
  after_update :notify_user, if: proc { saved_change_to_user_id? }

  def community_template
    templates = user.community.templates
    return {} if templates.nil?

    templates['notification_template_id']
  end

  private

  def notify_user
    EmailMsg.send_mail(user.email, community_template, mail_data)
  end

  def mail_data
    { "url": "#{ENV['HOST']}/todo" }
  end
end

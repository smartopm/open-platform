# frozen_string_literal: true

# Messages being sent out
class Message < ApplicationRecord
  belongs_to :user
  belongs_to :sender, class_name: 'User'

  default_scope { order(created_at: :asc) }

  class Unauthorized < StandardError; end

  def self.users_newest_msgs(offset, limit, com_id)
    Message.all.joins(:user, :sender)
           .select('DISTINCT ON (user_id) user_id, messages.id').unscope(:order)
           .where('(users.community_id=? AND senders_messages.community_id=?)', com_id, com_id)
           .order('user_id ASC, messages.created_at DESC').limit(limit).offset(offset)
  end

  def send_sms
    return if receiver.nil?

    text = 'Click this link to reply to this message in our app '
    link = "https://#{ENV['HOST']}/message/#{user_id}"
    new_message = "#{message} \n#{text} #{link}"
    Sms.send(receiver, new_message)
  end
end

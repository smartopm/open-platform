# frozen_string_literal: true

# Messages being sent out
class Message < ApplicationRecord
  belongs_to :user
  belongs_to :sender, class_name: 'User'

  default_scope { order(created_at: :asc) }

  class Unauthorized < StandardError; end

  def send_sms
    return if receiver.nil?
    
    text = "Click this link to reply to this message in our app "
    link = "https://#{ENV['HOST']}/message/#{user_id}"
    new_message = "#{message} \n#{text} #{link}"
    Sms.send(receiver, new_message)
  end
end

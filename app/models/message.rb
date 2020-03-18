# frozen_string_literal: true

# Messages being sent out
class Message < ApplicationRecord
  belongs_to :user
  belongs_to :sender, class_name: 'User'

  default_scope { order(created_at: :desc) }

  class Unauthorized < StandardError; end

  def send_sms
    return if receiver.empty?
    
    Sms.send(receiver, message)
  end
end

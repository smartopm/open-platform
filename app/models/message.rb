# frozen_string_literal: true

# Messages being sent out
class Message < ApplicationRecord
  belongs_to :user
  
  default_scope { order(created_at: :desc) }

  class Unauthorized < StandardError; end

  def send_sms(to, msg)
    Sms.send(to, msg)
  end
end

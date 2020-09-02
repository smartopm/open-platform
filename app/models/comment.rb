# frozen_string_literal: true

require 'comment_stats'

# comments
class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :discussion

  has_one_attached :image
  after_create :send_alert

  default_scope { order(created_at: :desc) }

  IMAGE_ATTACHMENTS = {
    image_blob_id: :image,
  }.freeze

  def send_alert
    puts "I got called .................."
    CommentsAlert.send_email_alert
  end
end

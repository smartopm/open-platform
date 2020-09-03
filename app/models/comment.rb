# frozen_string_literal: true

require 'comment_alert'

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

  # testing the email alert on new comment 
  def send_alert
    CommentsAlert.send_email_alert(user.community.name)
  end
end

# frozen_string_literal: true

require 'comment_alert'
# comments
class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :discussion

  has_one_attached :image

  default_scope { order(created_at: :desc) }
  scope :created_today, -> { where(['created_at >= ?', Time.zone.now.beginning_of_day]) }
  scope :by_discussion, ->(disc_id, usr) { where(discussion_id: disc_id, user_id: usr) }

  IMAGE_ATTACHMENTS = {
    image_blob_id: :image,
  }.freeze
end

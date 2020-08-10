# frozen_string_literal: true

# comments
class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :discussion

  has_one_attached :image

  default_scope { order(created_at: :desc) }

  IMAGE_ATTACHMENTS = {
    image_blob_id: :image,
  }.freeze
end

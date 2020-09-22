# frozen_string_literal: true

# comments
class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :discussion

  has_one_attached :image
  before_save :ensure_default_state

  after_create :populate_activity_points

  default_scope { order(created_at: :desc) }
  scope :created_today, -> { where(['created_at >= ?', Time.zone.now.beginning_of_day]) }
  scope :by_discussion, ->(disc_id, usr) { where(discussion_id: disc_id, user_id: usr) }
  scope :by_not_deleted, -> { where.not(status: 'deleted') }

  IMAGE_ATTACHMENTS = {
    image_blob_id: :image,
  }.freeze

  def ensure_default_state
    self[:status] ||= 'valid'
  end

  private

  def populate_activity_points
    ActivityPointsJob.perform_now(user.id, "user_comment")
  end
end

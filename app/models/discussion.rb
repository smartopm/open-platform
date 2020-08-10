# frozen_string_literal: true

# discussions
class Discussion < ApplicationRecord
  belongs_to :user
  belongs_to :community
  has_many :comments, dependent: :destroy
  has_many :discussion_users, dependent: :destroy
  has_many :users, through: :discussion_users

  has_one_attached :image

  default_scope { order(created_at: :desc) }

  ATTACHMENTS = {
    image_blob_id: :image,
  }.freeze

  # we will use this for updating discussions
  def start_discussion(vals)
    discussion = community.discussions.new(vals.except(*ATTACHMENTS.keys))
    discussion.image.attach(:image)
    return discussion if discussion.images.attached?
  end

  def follow_or_unfollow_discussion(user, discussion_id)
    a_discussion = DiscussionUser.find_by(user_id: user.id, discussion_id: discussion_id)

    if a_discussion.present?
      a_discussion.delete
    else
      DiscussionUser.create!(user_id: user.id, discussion_id: self[:id])
    end
  end
end

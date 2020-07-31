# frozen_string_literal: true

# discussions
class Discussion < ApplicationRecord
  belongs_to :user
  belongs_to :community
  has_many :comments, dependent: :destroy
  has_many :discussion_users, dependent: :destroy
  has_many :users, through: :discussion_users
  default_scope { order(created_at: :desc) }

  def follow_or_unfollow_discussion(user)
    a_discussion = DiscussionUser.find_by(user_id: user.id)

    if a_discussion.present?
      a_discussion.delete
    else
      DiscussionUser.create!(user_id: user.id, discussion_id: self[:id])
    end
  end
end

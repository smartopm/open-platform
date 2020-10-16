# frozen_string_literal: true

# discussions
class Discussion < ApplicationRecord
  belongs_to :user
  belongs_to :community
  has_many :comments, dependent: :destroy
  has_many :discussion_users, dependent: :destroy
  has_many :users, through: :discussion_users
  default_scope { order(created_at: :desc) }

  scope :valid, -> { where.not(status: 'deleted') }

  scope :by_subscribers, lambda { |disc_ids|
    User.joins(:discussion_users).where(discussion_users: { discussion_id: disc_ids }).distinct
  }
  scope :by_commented_today, lambda {
    joins(:comments).where(['comments.created_at >= ?', Time.zone.now.beginning_of_day])
  }

  def follow_or_unfollow_discussion(user, discussion_id)
    a_discussion = DiscussionUser.find_by(user_id: user.id, discussion_id: discussion_id)

    if a_discussion.present?
      a_discussion.delete
    else
      DiscussionUser.create!(user_id: user.id, discussion_id: self[:id])
    end
  end
end

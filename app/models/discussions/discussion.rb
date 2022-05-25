# frozen_string_literal: true

module Discussions
  # discussions
  class Discussion < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :community
    has_many :comments, class_name: 'Comments::Comment', dependent: :destroy
    has_many :discussion_users, dependent: :destroy
    has_many :users, class_name: 'Users::User', through: :discussion_users
    has_many :posts, dependent: :destroy

    enum author: { user: 0, system: 1 }

    default_scope { order(created_at: :desc).where.not(status: 'deleted') }

    scope :by_subscribers, lambda { |disc_ids|
      Users::User.joins(:discussion_users).where(discussion_users: { discussion_id: disc_ids })
                 .distinct
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
end

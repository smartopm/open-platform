# frozen_string_literal: true

# PostTag, tags from wordpress
class PostTag < ApplicationRecord
    belongs_to :community
    has_many :post_tag_users, dependent: :destroy
    has_many :users, through: :post_tag_users
    validates :title, presence: true, uniqueness: true

    def follow_or_unfollow_tag(user_id)
        tag = PostTagUser.find_by(user_id: user_id, post_tag_id: self[:id])

        if tag.present?
          tag.delete
        else
          PostTagUser.create!(user_id: user_id, post_tag_id: self[:id])
        end
    end
end
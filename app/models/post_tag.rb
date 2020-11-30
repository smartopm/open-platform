# frozen_string_literal: true

# PostTag, tags from wordpress
class PostTag < ApplicationRecord
    belongs_to :community
    has_many :post_tag_users, dependent: :destroy
    has_many :users, through: :post_tag_users
    validates :title, presence: true, uniqueness: true
end
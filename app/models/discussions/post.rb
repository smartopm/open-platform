# frozen_string_literal: true

module Discussions
  # Post
  class Post < ApplicationRecord
    has_many_attached :images

    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :discussion

    validates :accessibility, inclusion: { in: %w[admins everyone].freeze, allow_nil: true }

    enum status: { active: 0, deleted: 1 }

    default_scope { where.not(status: 'deleted').order(created_at: :desc) }
    scope :by_accessibility, lambda { |user_type|
      where(accessibility: [nil, 'everyone']) unless user_type.eql?('admin')
    }
  end
end

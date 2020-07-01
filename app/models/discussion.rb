# frozen_string_literal: true

# discussions
class Discussion < ApplicationRecord
  belongs_to :user
  belongs_to :community
  has_many :comments, dependent: :destroy

  default_scope { order(created_at: :desc) }
end

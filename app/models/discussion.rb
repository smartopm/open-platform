class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :community
    has_many :comments

    default_scope { order(created_at: :desc) }
end

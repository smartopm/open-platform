class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :discussion

    default_scope { order(created_at: :desc) }
end

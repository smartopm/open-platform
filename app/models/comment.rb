class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :author, class_name : 'User'

    default_scope { order(created_at: :desc) }
end

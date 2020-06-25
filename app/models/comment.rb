class Comment < ApplicationRecord
    belongs_to :user # I think :author, class_name: 'User' can work too

    default_scope { order(created_at: :desc) }
end

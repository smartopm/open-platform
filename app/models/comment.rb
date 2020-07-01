class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :discussion # disable discussions for now ...

    default_scope { order(created_at: :desc) }
end

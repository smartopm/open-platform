module Logs
    class Invite < ApplicationRecord
        has_one :entry_time, as: :visitable
        belongs_to :host, class_name: 'Users::User'
        belongs_to :visitor, class_name: 'Users::User'
    end
end
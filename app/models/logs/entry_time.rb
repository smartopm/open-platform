module Logs
    class EntryTime < ApplicationRecord
        belongs_to :visitable, polymorphic: true
        belongs_to :community
    end
end
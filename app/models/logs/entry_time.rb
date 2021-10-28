module Logs
    class EntryTime < ApplicationRecord
        belongs_to :visitable, polymorphic: true
    end
end
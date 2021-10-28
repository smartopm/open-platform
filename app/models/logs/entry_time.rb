# frozen_string_literal: true

module Logs
  # Keep record of entry time for all entries
  class EntryTime < ApplicationRecord
    belongs_to :visitable, polymorphic: true
    belongs_to :community
  end
end

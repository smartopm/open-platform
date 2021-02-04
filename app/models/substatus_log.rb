# frozen_string_literal: true

# Substatus Log
class SubstatusLog < ApplicationRecord
  belongs_to :community
  belongs_to :user
end

# frozen_string_literal: true

# AssigneeNote
class AssigneeNote < ApplicationRecord
  belongs_to :user
  belongs_to :note
end

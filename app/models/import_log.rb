# frozen_string_literal: true

# User Import Log
class ImportLog < ApplicationRecord
  belongs_to :community
  belongs_to :user

  validates :file_name, presence: true
end

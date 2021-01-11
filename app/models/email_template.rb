# frozen_string_literal: true

# email templates
class EmailTemplate < ApplicationRecord
  belongs_to :community

  validates :name, presence: true, uniqueness: true
end

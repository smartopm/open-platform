# frozen_string_literal: true

# email templates
class EmailTemplate < ApplicationRecord
  belongs_to :community
  belongs_to :templatable, polymorphic: true

  validates :name, presence: true, uniqueness: true
end

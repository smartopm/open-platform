# frozen_string_literal: true

# Label
class Label < ApplicationRecord
  belongs_to :community
  has_many :user_labels, dependent: :destroy
  has_many :users, through: :user_labels
end

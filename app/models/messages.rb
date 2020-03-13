# frozen_string_literal: true

# Messages being sent out
class Message < ApplicationRecord
  belongs_to :user
  belongs_to :sender, class_name: 'User'

  default_scope { order(created_at: :desc) }
end

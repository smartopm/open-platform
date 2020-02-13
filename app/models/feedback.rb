# frozen_string_literal: true

class Feedback < ApplicationRecord
  belongs_to :user
  belongs_to :author, class_name: 'User'
end

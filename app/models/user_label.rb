# frozen_string_literal: true

# UserLabel
class UserLabel < ApplicationRecord
  belongs_to :user
  belongs_to :label
end

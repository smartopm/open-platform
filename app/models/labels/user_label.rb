# frozen_string_literal: true

module Labels
  # UserLabel
  class UserLabel < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :label
  end
end

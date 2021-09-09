# frozen_string_literal: true

module Discussions
  # Discussion users ==> user ==> discussion
  class DiscussionUser < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :discussion
  end
end

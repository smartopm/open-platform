# frozen_string_literal: true

module Discussions
  # Discussion users ==> user ==> discussion
  class DiscussionUser < ApplicationRecord
    belongs_to :user, class_name: 'Users::User', dependent: :destroy
    belongs_to :discussion, dependent: :destroy
  end
end

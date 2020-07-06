# frozen_string_literal: true

# Discussion users ==> user ==> discussion
class DiscussionUser < ApplicationRecord
  belongs_to :user, dependent: :destroy
  belongs_to :discussion, dependent: :destroy
end

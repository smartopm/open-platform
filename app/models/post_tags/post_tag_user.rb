# frozen_string_literal: true

# Manages PostTags
module PostTags
  # PostTagUser ==> to be used to check what tag is a user subscribed to
  class PostTagUser < ApplicationRecord
    belongs_to :user, class_name: 'Users::User', dependent: :destroy
    belongs_to :post_tag, dependent: :destroy
  end
end

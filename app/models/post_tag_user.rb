# frozen_string_literal: true

# PostTagUser ==> to be used to check what tag is a user subscribed to
class PostTagUser < ApplicationRecord
    belongs_to :user, dependent: :destroy
    belongs_to :post_tag, dependent: :destroy
end
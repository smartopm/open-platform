# frozen_string_literal: true

# PostTag, tags from wordpress
class PostTag < ApplicationRecord
    belongs_to :community
end
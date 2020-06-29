# frozen_string_literal: true

# comment queries
module Types::Queries::Comment
  extend ActiveSupport::Concern

  included do
    # Get comments
    field :comments, [Types::CommentType], null: true do
      description 'Get all comment entries per post'
      argument :post_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def comments(offset: 0, limit: 100, post_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    # Find out if we can use User.allowed...
    Comment.where(community_id: context[:current_user].community_id, post_id: post_id)
            .limit(limit)
            .offset(offset)
  end
end

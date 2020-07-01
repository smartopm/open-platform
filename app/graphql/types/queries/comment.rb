# frozen_string_literal: true

# comment queries
module Types::Queries::Comment
  extend ActiveSupport::Concern

  included do
    # Get comments
    field :comments, [Types::CommentType], null: true do
      description 'Get all comment entries per post'
      argument :post_id, String, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get comments
    field :discussions, [Types::DiscussionType], null: true do
      description 'Get all discussion'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def comments(offset: 0, limit: 100, post_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discs = Discussion.find_by(community_id: context[:current_user].community_id, post_id: post_id)
    return [] if discs.nil?

    discs.comments.limit(limit).offset(offset)
  end

  def discussions
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discussions = Discussion.where(community_id: context[:current_user].community_id)
    return [] if discussions.nil?

    discussions
  end
end

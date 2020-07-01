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

    # Get discussions
    field :discussions, [Types::DiscussionType], null: true do
      description 'Get all discussion'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end  

    # Get discussion
    field :discussion_post, Types::DiscussionType, null: true do
      description 'Get a discussion for a post id'
       argument :post_id, String, required: true
    end
  end

  def comments(offset: 0, limit: 100, post_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discs = community_discussions(post_id)
    return [] if discs.nil?

    discs.comments.limit(limit).offset(offset)
  end

  def discussions(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discussions = Discussion.where(community_id: context[:current_user].community_id)
    return [] if discussions.nil?

    discussions.limit(limit).offset(offset)
  end  
  
  def discussion_post(post_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discussion = community_discussions(post_id)
    discussion
  end

  def community_discussions(post_id)
    return if post_id.nil?

    discs = Discussion.find_by(community_id: context[:current_user].community_id, post_id: post_id)
    discs
  end
end

# frozen_string_literal: true

# comment queries
module Types::Queries::Comment
  extend ActiveSupport::Concern

  included do
    # Get comments for wordpress posts
    field :post_comments, [Types::CommentType], null: true do
      description 'Get all comment entries per post'
      argument :post_id, String, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get comments for wordpress posts
    field :discuss_comments, [Types::CommentType], null: true do
      description 'Get all comment entries per post'
      argument :id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get all discussions
    field :discussions, [Types::DiscussionType], null: true do
      description 'Get all discussions'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get discussion
    field :discussion, Types::DiscussionType, null: true do
      description 'Get a discussion '
      argument :id, GraphQL::Types::ID, required: true
    end

    # Get discussion for wordpress posts ==>
    field :post_discussion, Types::DiscussionType, null: true do
      description 'Get a discussion for wordpress pages using postId'
      argument :post_id, String, required: true
    end
  end

  def post_comments(offset: 0, limit: 100, post_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discs = community_discussions(post_id, 'post')
    return [] if discs.nil?

    discs.comments.limit(limit).offset(offset)
  end

  def discuss_comments(offset: 0, limit: 100, id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discs = community_discussions(id, 'discuss')
    return [] if discs.nil?

    discs.comments.limit(limit).offset(offset)
  end

  def discussions(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discussions = context[:current_user].community.discussions.where(post_id: nil)
                                        .limit(limit).offset(offset)
    discussions
  end

  def discussion(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discussion = community_discussions(id, 'discuss')
    discussion
  end

  def post_discussion(post_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discussion = community_discussions(post_id, 'post')
    discussion
  end

  def community_discussions(id, type)
    return if id.nil?

    discs = context[:current_user].find_user_discussion(id, type)
    discs
  end
end

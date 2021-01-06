# frozen_string_literal: true

# comment queries
module Types::Queries::Comment
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
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

    # Get all comments made on posts
    field :fetch_comments, [Types::CommentType], null: true do
      description 'Get all comments made on a post'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end
  # rubocop:enable Metrics/BlockLength

  def post_comments(post_id:, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discs = community_discussions(post_id, 'post')
    return [] if discs.nil?

    discs.comments.by_not_deleted.limit(limit).offset(offset).with_attached_image
  end

  def discuss_comments(id:, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    discs = community_discussions(id, 'discuss')
    return [] if discs.nil?

    discs.comments.by_not_deleted.limit(limit).offset(offset).with_attached_image
  end

  def discussions(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].discussions.where(post_id: nil)
                            .limit(limit).offset(offset)
  end

  def discussion(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    community_discussions(id, 'discuss')
  end

  def post_discussion(post_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    community_discussions(post_id, 'post')
  end

  def community_discussions(id, type)
    return if id.nil?

    context[:current_user].find_user_discussion(id, type)
  end

  def fetch_comments(offset: 0, limit: 20)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

    context[:site_community].comments.by_not_deleted.eager_load(:user, :discussion)
                            .limit(limit).offset(offset)
  end
end

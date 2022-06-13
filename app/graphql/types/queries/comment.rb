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

    # Get all comments made on posts
    field :fetch_comments, [Types::CommentType], null: true do
      description 'Get all comments made on a post'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end
  def post_comments(post_id:, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    discs = community_discussions(post_id, 'post')
    return [] if discs.nil?

    discs.comments.by_not_deleted.limit(limit).offset(offset)
  end

  def discuss_comments(id:, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    discs = community_discussions(id, 'discuss')
    return [] if discs.nil?

    discs.comments.by_not_deleted.limit(limit).offset(offset).with_attached_image
  end

  def fetch_comments(offset: 0, limit: 20)
    unless permitted?(module: :comment, permission: :can_fetch_all_comments)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].comments.by_not_deleted.eager_load(:user, :discussion)
                            .limit(limit).offset(offset)
  end
end

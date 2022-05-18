# frozen_string_literal: true

# post queries
module Types::Queries::Post
  extend ActiveSupport::Concern

  included do
    field :discussion_posts, [Types::PostType], null: false do
      description 'Returns list of posts of specific discussion'
      argument :discussion_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :community_news_posts, [Types::PostType], null: false do
      description 'Returns list of posts of specific discussion'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def discussion_posts(discussion_id:, limit: 5, offset: 0)
    unless permitted?(module: :discussion, permission: :can_view_posts)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    discussion = context[:site_community].discussions.find(discussion_id)
    discussion.posts.by_accessibility(context[:current_user].user_type).offset(offset).limit(limit)
  end

  def community_news_posts(limit: 5, offset: 0)
    unless permitted?(module: :discussion, permission: :can_view_posts)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    discussion = context[:site_community].discussions.find_by(title: 'Community News')
    return [] if discussion.nil?

    discussion.posts.by_accessibility(context[:current_user].user_type).offset(offset).limit(limit)
  end
end

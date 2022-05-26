# frozen_string_literal: true

# comment queries
module Types::Queries::Discussion
  extend ActiveSupport::Concern

  included do
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

    # Get the 5 required discussion topics
    field :system_tagged_discussions, [Types::DiscussionType], null: true do
      description 'Get system discussion topics for community'
    end
  end

  def discussions(offset: 0, limit: 100)
    unless permitted?(module: :discussion, permission: :can_access_all_discussions)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].discussions.where(post_id: nil)
                            .limit(limit).offset(offset)
  end

  def discussion(id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    community_discussions(id, 'discuss')
  end

  def post_discussion(post_id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    community_discussions(post_id, 'post')
  end

  def community_discussions(id, type)
    return if id.nil?

    context[:current_user].find_user_discussion(id, type)
  end

  def system_tagged_discussions
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    context[:site_community].discussions.system
  end
end

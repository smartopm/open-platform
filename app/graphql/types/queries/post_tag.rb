# frozen_string_literal: true

# post_tag queries
module Types::Queries::PostTag
  extend ActiveSupport::Concern

  included do
    # Get tags user follows
    field :user_tags, Types::PostTagUserType, null: true do
      description 'check if a user follows a tag'
      argument :tag_name, String, required: true
    end
  end

  def user_tags(tag_name:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    tag = context[:site_community].post_tags.find_by(name: tag_name)
    raise GraphQL::ExecutionError, 'Tag not found' if tag.blank?

    PostTagUser.find_by(user_id: context[:current_user].id, post_tag_id: tag.id)
  end
end

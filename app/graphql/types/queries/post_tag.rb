# frozen_string_literal: true

# post_tag queries
module Types::Queries::PostTag
    extend ActiveSupport::Concern
  
    included do
      # Get tags user follows
      field :tags_user_follows, Types::PostTagUserType, null: true do
        description 'check if a user follows a tag'
        argument :tag_name, String, required: true
      end
    end
  
    def tags_user_follows(tag_name:)
        raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

        tag = context[:site_community].post_tags.find_by(title: tag_name)
        raise GraphQL::ExecutionError, 'Tag not found' unless tag.present?
        
        PostTagUser.find_by(user_id: context[:current_user].id, post_tag_id: tag.id)
    end
end
  
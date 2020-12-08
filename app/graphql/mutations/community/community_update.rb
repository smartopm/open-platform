# frozen_string_literal: true

module Mutations
  module Community
    # Updating community details
    class CommunityUpdate < BaseMutation
      argument :name, String, required: false
      argument :support_number, GraphQL::Types::JSON, required: false
      argument :support_email, GraphQL::Types::JSON, required: false
      argument :image_blob_id, String, required: false

      field :community, Types::CommunityType, null: true

      def resolve(vals)
        community = context[:site_community].update(vals.except(:image_blob_id))

        context[:site_community].attach_image(vals) if vals[:image_blob_id].present?

        return { community: context[:site_community] } if community

        raise GraphQL::ExecutionError, community.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

# frozen_string_literal: true

module Mutations
  module Community
    # Updating community details
    class CommunityEmergency < BaseMutation
      
      field :success, Boolean, null: true

      def resolve(_vals)
       
        return { success: true } if context[:site_community].send_emergency_sms

        raise GraphQL::ExecutionError, community.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        puts context[:current_user]
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

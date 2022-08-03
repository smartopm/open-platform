# frozen_string_literal: true

module Mutations
  module Community
    # Send an sms to security team canceling emergency request
    class CommunityEmergencyCancel < BaseMutation
      field :success, Boolean, null: true

      def resolve
        return { success: true } if context[:site_community]
                                    .craft_am_safe_sms(
                                      current_user: context[:current_user],
                                    )

        raise GraphQL::ExecutionError, community.errors.full_messages
      end

      def authorized?
        return true if permitted?(module: :sos, permission: :can_cancel_sos)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

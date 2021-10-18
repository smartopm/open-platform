# frozen_string_literal: true

module Mutations
  module Community
    # Send an sms to security team canceling emergency request
    class CommunityEmergencyCancel < BaseMutation
      field :success, Boolean, null: true

      def resolve
        if context[:current_user].blank?
          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end

        return { success: true } if context[:site_community]
                                    .craft_am_safe_sms(
                                      current_user: context[:current_user],
                                    )

        raise GraphQL::ExecutionError, community.errors.full_messages
      end
    end
  end
end
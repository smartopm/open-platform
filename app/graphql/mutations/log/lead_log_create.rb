# frozen_string_literal: true

module Mutations
  module Log
    # Create lead log
    class LeadLogCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :name, String, required: false
      argument :log_type, String, required: true

      field :success, Boolean, null: true

      def resolve(vals)
        lead_log = context[:site_community].lead_logs.create(
          vals.merge(acting_user_id: context[:current_user].id),
        )
        return { success: true } if lead_log.persisted?

        raise GraphQL::ExecutionError, lead_logs.errors.full_messages&.join(', ')
      end

      def authorized?(_vals)
        return true if permitted?(module: :lead_log, permission: :can_create_lead_log)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

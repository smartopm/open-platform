# frozen_string_literal: true

module Mutations
  module Log
    # Create lead log
    class LeadLogCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :name, String, required: false
      argument :log_type, String, required: true
      argument :amount, Float, required: false
      argument :deal_size, Float, required: false
      argument :investment_target, Float, required: false

      field :success, Boolean, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        validate_investment_attributes(vals) if vals[:log_type].eql?('deal_details')
        lead_log = context[:site_community].lead_logs.create(
          vals.merge(acting_user_id: context[:current_user].id),
        )
        return { success: true } if lead_log.persisted?

        raise GraphQL::ExecutionError, lead_logs.errors.full_messages&.join(', ')
      end
      # rubocop:enable Metrics/AbcSize

      def validate_investment_attributes(vals)
        return if vals[:deal_size].present? && vals[:investment_target].present?

        raise_error_message(I18n.t('errors.lead_log.empty_deal_details'))
      end

      def authorized?(_vals)
        return true if permitted?(module: :lead_log, permission: :can_create_lead_log)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

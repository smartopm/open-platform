# frozen_string_literal: true

module Mutations
  module Log
    # Create lead log
    class LeadLogCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :name, String, required: false
      argument :signed_deal, String, required: false
      argument :log_type, String, required: true

      field :lead_log, Types::LeadLogType, null: true
      
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        return if signed_deal_present?(vals[:log_type], vals[:user_id])

        lead_log = context[:site_community].lead_logs.create(
          vals.merge(acting_user_id: context[:current_user].id),
        )
        return { lead_log: lead_log } if lead_log.persisted?

        raise GraphQL::ExecutionError, lead_logs.errors.full_messages&.join(', ')
      end
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        return true if permitted?(module: :lead_log, permission: :can_create_lead_log)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      def signed_deal_present?(log_type, user_id)
        return false unless log_type.eql?('signed_deal')

        context[:site_community].lead_logs.find_by(log_type: 'signed_deal', user_id: user_id)
      end
    end
  end
end

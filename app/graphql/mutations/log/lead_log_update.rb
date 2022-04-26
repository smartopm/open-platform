# frozen_string_literal: true

module Mutations
  module Log
    # Update lead log
    class LeadLogUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false

      field :lead_log, Types::LeadLogType, null: true

      def resolve(vals)
        lead_log = context[:site_community].lead_logs.find_by(id: vals[:id])
        raise_error(I18n.t('errors.lead_log.not_found')) if lead_log.blank?

        return { lead_log: lead_log } if lead_log.update(vals.except('id'))

        raise_error(lead_log.errors.full_messages&.join(', '))
      end

      def authorized?(_vals)
        return true if permitted?(module: :lead_log, permission: :can_update_lead_log)

        raise_error(I18n.t('errors.unauthorized'))
      end

      def raise_error(error_message)
        raise GraphQL::ExecutionError, error_message
      end
    end
  end
end

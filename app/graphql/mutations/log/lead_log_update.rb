# frozen_string_literal: true

module Mutations
  module Log
    # Update lead log
    class LeadLogUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :amount, Float, required: false

      field :lead_log, Types::LeadLogType, null: true

      def resolve(vals)
        lead_log = context[:site_community].lead_logs.find(vals[:id])
        validate_log_type(lead_log.log_type, vals[:amount])
        return { lead_log: lead_log } if lead_log.update(vals.except('id'))

        raise_error_message(lead_log.errors.full_messages&.join(', '))
      end

      def authorized?(_vals)
        validate_authorization(:lead_log, :can_update_lead_log)
      end

      private

      def validate_log_type(log_type, amount)
        return if investment?(log_type, amount) || updatable_log?(log_type, amount)

        raise_error_message(I18n.t('errors.lead_log.cannot_edit'))
      end

      def investment?(log_type, amount)
        return true if amount.present? && log_type.eql?('investment')
      end

      def updatable_log?(log_type, amount)
        return true if amount.nil? && %w[event meeting investment].include?(log_type)
      end
    end
  end
end

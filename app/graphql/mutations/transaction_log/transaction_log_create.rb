# frozen_string_literal: true

module Mutations
  module TransactionLog
    # Create transactionlog
    class TransactionLogCreate < BaseMutation
      argument :paid_amount, Float, required: true
      argument :amount, Float, required: true
      argument :currency, String, required: true
      argument :invoice_number, String, required: true
      argument :transaction_id, String, required: true
      argument :transaction_ref, String, required: true
      argument :description, String, required: false
      argument :account_name, String, required: false

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        log_attributes = vals.merge(community_id: context[:site_community].id)
        log = context[:current_user].transaction_logs.create!(log_attributes)

        return { success: true } if log.persisted?

        raise GraphQL::ExecutionError, log.errors.full_messages
      end

      def authorized?(_vals)
        return true if permitted?(module: :transaction, permission: :can_make_payment)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

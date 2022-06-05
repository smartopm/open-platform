# frozen_string_literal: true

module Mutations
  module TransactionLog
    # Create transactionlog
    class TransactionLogCreate < BaseMutation
      argument :paid_amount, Float, required: true
      argument :amount, Float, required: true
      argument :currency, String, required: true
      argument :invoice_number, String, required: true
      argument :transaction_id, Integer, required: true
      argument :transaction_ref, Integer, required: true
      argument :description, String, required: false

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        log = context[:site_community].transaction_logs.new(vals)

        return { success: true } if log.save!

        raise GraphQL::ExecutionError, log.errors.full_messages&.join(', ')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :transaction, permission: :can_revert_transaction)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

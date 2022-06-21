# frozen_string_literal: true

require 'flutterwave_charger'
module Mutations
  module Flutterwave
    # Verify transactions from flutterwave
    class TransactionVerify < BaseMutation
      argument :transaction_id, String, required: true

      field :success, Boolean, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(transaction_id:)
        validate_authorization(:transaction, :can_make_payment)
        response = FlutterwaveCharger.verify_transaction(transaction_id,
                                                         context[:site_community].id)
        raise_error_message(error_message(response)) unless response['status'].eql?('success')

        transaction_log = context[:site_community].transaction_logs
                                                  .create(transaction_data(response))
        return { success: true } if transaction_log.persisted?

        raise_error_message(transaction_log.errors.full_messages&.join(', '))
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end
      # rubocop:enable Metrics/AbcSize

      # rubocop:disable Metrics/MethodLength
      def transaction_data(response)
        data = response['data']
        meta_data = response.dig('data', 'meta')
        {
          paid_amount: data['amount'],
          currency: data['currency'],
          invoice_number: meta_data['invoice_number'],
          amount: meta_data['input_amount'],
          transaction_id: data['id'],
          transaction_ref: data['tx_ref'],
          description: meta_data['description'],
          integration_type: 'flutterwave',
          user_id: context[:current_user].id,
        }
      end
      # rubocop:enable Metrics/MethodLength

      def error_message(response)
        response['message'] || I18n.t('payment.transaction_failed')
      end
    end
  end
end

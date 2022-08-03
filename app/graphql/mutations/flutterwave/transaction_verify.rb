# frozen_string_literal: true

require 'flutterwave_charger'
module Mutations
  module Flutterwave
    # Verify transactions from flutterwave
    class TransactionVerify < BaseMutation
      argument :transaction_ref, String, required: true
      argument :transaction_id, ID, required: false

      field :status, String, null: true

      def resolve(vals)
        validate_authorization(:transaction, :can_make_payment)

        transaction_log = context[:site_community].transaction_logs
                                                  .find_by(transaction_ref: vals[:transaction_ref])

        status = transaction_status(transaction_log, vals)
        { status: status }
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end

      def transaction_status(transaction_log, vals)
        return transaction_log.status unless webhook_changed_status?(transaction_log.status)

        verify_transaction(vals)
      end

      def webhook_changed_status?(status)
        ['pending', nil].include?(status)
      end

      def verify_transaction(vals)
        return perform_verification(vals[:transaction_id]) if vals[:transaction_id].present?

        cancel_transaction(vals[:transaction_ref])
      end

      # rubocop:disable Metrics/AbcSize
      def perform_verification(transaction_id)
        response = FlutterwaveCharger.verify_transaction(transaction_id,
                                                         context[:site_community].id)
        raise_error_message(error_message(response)) unless response['status'].eql?('success')

        transaction_ref = response.dig('data', 'tx_ref')
        transaction_log = context[:site_community].transaction_logs
                                                  .find_by(transaction_ref: transaction_ref)
        return transaction_log.status if transaction_log.update(transaction_data(response))

        raise_error_message(transaction_log.errors.full_messages&.join(', '))
      end
      # rubocop:enable Metrics/AbcSize

      def cancel_transaction(transaction_ref)
        transaction_log = context[:site_community].transaction_logs
                                                  .find_by(transaction_ref: transaction_ref)
        return transaction_log.status if transaction_log.update(status: :cancelled)

        raise_error_message(transaction_log.errors.full_messages&.join(', '))
      end

      def transaction_data(response)
        data = response['data']
        {
          paid_amount: data['amount'],
          currency: data['currency'],
          transaction_id: data['id'],
          status: :successful,
          meta_data: response.to_json,
        }
      end

      def error_message(response)
        response['message'] || I18n.t('payment.transaction_failed')
      end
    end
  end
end

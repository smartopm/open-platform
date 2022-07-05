# frozen_string_literal: true

require 'flutterwave_charger'
require 'host_env'

module Mutations
  module Flutterwave
    # Initiate transaction on flutterwave
    class TransactionInitiate < BaseMutation
      include CurrencyHelper

      argument :amount, Float, required: true
      argument :invoice_number, String, required: true
      argument :description, String, required: false

      field :payment_link, String, null: true

      def resolve(vals)
        validate_authorization(:transaction, :can_make_payment)
        response = FlutterwaveCharger.generate_link(payload(vals), context[:site_community].id)
        raise_error_message(error_message(response)) unless response['status'].eql?('success')

        payment_link = response.dig('data', 'link')
        create_transaction_log(payment_link, vals)
        { payment_link: payment_link }
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end

      private

      def payload(vals)
        current_community = context[:site_community]
        {
          tx_ref: transaction_ref,
          amount: vals[:amount],
          currency: currency_codes[current_community.currency.to_sym],
          redirect_url: "https://#{HostEnv.base_url(current_community)}/payments/pay",
          customer: customer,
          customizations: customization(vals[:description]),
        }
      end

      def customer
        current_user = context[:current_user]
        {
          email: current_user.email,
          phonenumber: current_user.phone_number,
          name: current_user.name,
        }
      end

      def customization(description)
        {
          title: I18n.t('payment.pay_for_item'),
          description: description,
          logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        }
      end

      def error_message(response)
        response['message'] ||
          response.dig('errors', 0, 'message') ||
          I18n.t('payment.transaction_error')
      end

      def create_transaction_log(link, vals)
        context[:site_community].transaction_logs.create(vals.merge(
                                                           user_id: context[:current_user].id,
                                                           transaction_ref: transaction_ref,
                                                           payment_link: link,
                                                           status: :pending,
                                                         ))
      end

      def transaction_ref
        @transaction_ref ||= SecureRandom.urlsafe_base64(nil, false)
      end
    end
  end
end

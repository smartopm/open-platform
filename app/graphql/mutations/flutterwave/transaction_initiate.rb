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
      argument :redirect_to, String, required: true

      field :link, String, null: true

      def resolve(vals)
        validate_authorization(:transaction, :can_make_payment)
        response = FlutterwaveCharger.generate_link(payload(vals), context[:site_community].id)
        return { link: response.dig('data', 'link') } if response['status'].eql?('success')

        raise_error_message(error_message(response))
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end

      private

      def payload(vals)
        current_community = context[:site_community]
        {
          tx_ref: Time.zone.now,
          amount: vals[:amount],
          currency: currency_codes[current_community.currency.to_sym],
          redirect_url: "https://#{HostEnv.base_url(current_community)}#{vals[:redirect_to]}",
          customer: customer,
          meta: meta_data(vals),
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

      def meta_data(vals)
        {
          invoice_number: vals[:invoice_number],
          description: vals[:description],
          input_amount: vals[:amount],
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
    end
  end
end

# frozen_string_literal: true

# Flutterwave controller
class FlutterwaveController < ApplicationController
  include ApplicationHelper
  protect_from_forgery except: :webhook

  # rubocop:disable Metrics/AbcSize
  def webhook
    key = flutterwave_keys(current_community.name)
    signature = request.headers['verif-hash']
    return head :unauthorized if signature.blank? || (signature != key['SECRET_HASH'])

    transaction_log = Payments::TransactionLog.find_by(transaction_ref: params['txRef'])
    transaction_log.update!(transaction_data(params))
  rescue StandardError => e
    Rollbar.error(e)
    head :ok
  end
  # rubocop:enable Metrics/AbcSize

  private

  def transaction_data(data)
    {
      paid_amount: data[:amount],
      currency: data[:currency],
      transaction_id: data[:id],
      status: data[:status],
      meta_data: data.to_json,
    }
  end
end

# frozen_string_literal: true

# Transaction queries
module Types::Queries::Deposit
  extend ActiveSupport::Concern

  included do
    field :deposit, Types::WalletTransactionType, null: false do
      description 'return details for one deposit'
      argument :deposit_id, GraphQL::Types::ID, required: true
    end

    field :user_deposits, Types::DepositType, null: false do
      description 'return deposits for a user'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def deposit(deposit_id:)
    unless context[:current_user]&.admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].wallet_transactions.find(deposit_id)
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def user_deposits(user_id:, offset: 0, limit: 10)
    unless context[:current_user]&.admin? || user_id.eql?(context[:current_user]&.id)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, I18n.t('errors.user.not_found') if user.blank?

    pending_invoices = add_balance_and_parcel_number(user.invoices.not_cancelled
                                                    .where('pending_amount > ?', 0))
    {
      transactions: user.wallet_transactions.includes(payment_plan: [:land_parcel])
                        .eager_load(:payment_plan).limit(limit).offset(offset).reverse,
      pending_invoices: pending_invoices,
    }
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def add_balance_and_parcel_number(invoices)
    balance = 0
    pending_invoices = []
    invoices.reverse.each do |invoice|
      invoice_data = invoice.attributes
      balance += invoice.pending_amount
      invoice_data['balance'] = balance
      invoice_data['parcel_number'] = invoice.land_parcel.parcel_number
      pending_invoices.push(invoice_data)
    end
    pending_invoices
  end
end

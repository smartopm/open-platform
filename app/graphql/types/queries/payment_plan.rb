# frozen_string_literal: true

# Payment queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::PaymentPlan
  extend ActiveSupport::Concern

  included do
    field :user_plans_with_payments, [Types::PaymentPlanType], null: true do
      description 'return payment plans for user'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :payment_plan_statement, Types::PaymentPlanDetailType, null: true do
      description 'Fetch statements of payment plan'
      argument :land_parcel_id, GraphQL::Types::ID, required: true
    end
  end

  # Returns list of user's all payment plans
  #
  # @param user_id [String]
  # @param offset [Integer]
  # @param limit [Integer]
  #
  # @return [Array<PaymentPlan>]
  def user_plans_with_payments(user_id: nil, offset: 0, limit: 10)
    user = verified_user(user_id)
    payment_plans = user.payment_plans.includes(:plan_payments).where.not(pending_balance: 0)

    if context[:current_user].admin?
      payment_plans.order(created_at: :desc).offset(offset).limit(limit)
    else
      payment_plans.where.not(plan_payments: { status: :cancelled }).order(
        created_at:
        :desc,
      ).offset(offset).limit(limit)
    end
  end

  # Payment plan statement details of land parcel.
  #
  # @param [String] LandParcel#id
  #
  # @return [Hash]
  def payment_plan_statement(land_parcel_id:)
    raise_unauthorized_error
    parcel = context[:site_community].land_parcels.find_by(id: land_parcel_id)
    raise_land_parcel_not_found_error(parcel)
    payment_plan = parcel.payment_plan
    {
      payment_plan: payment_plan,
      statements: statement_details(payment_plan),
    }
  end

  private

  # Raises GraphQL execution error if user is unauthorized.
  #
  # @return [GraphQL::ExecutionError]
  def raise_unauthorized_error
    return if context[:current_user]&.admin?

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end

  # Raises GraphQL execution error if land parcel does not exist.
  #
  # @return [GraphQL::ExecutionError]
  def raise_land_parcel_not_found_error(land_parcel)
    return if land_parcel

    raise GraphQL::ExecutionError, I18n.t('errors.land_parcel.not_found')
  end

  # Statement details of payment plan.
  # * Combines paid and unpaid statement details.
  #
  # @param [PaymentPlan] plan
  #
  # @return [Array]
  def statement_details(plan)
    paid_statement_details(plan) + unpaid_statement_details(plan)
  end

  # Paid Statement details of payment plan.
  #
  # @param [PaymentPlan] plan
  #
  # @return [Array]
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def paid_statement_details(plan)
    payment_details = plan_payment_details(plan.plan_payments)

    remaining_amount = 0
    monthly_amount = plan.monthly_amount
    statement_details = []
    payment_details.each_with_index do |details, index|
      paid_monthly_amount = details[:amount] + remaining_amount
      paid_installments = (paid_monthly_amount / monthly_amount).floor
      remaining_amount = paid_monthly_amount - (monthly_amount * paid_installments)
      paid_installments.times do |_installment|
        statement_details.push(
          {
            transaction_number: details[:transaction_number],
            payment_date: details[:created_at],
            amount_paid: monthly_amount,
            balance: 0,
            status: 'paid',
          },
        )
      end
      next if index != (payment_details.size - 1) || remaining_amount.zero?

      statement_details.push(
        {
          transaction_number: details[:transaction_number],
          payment_date: details[:created_at],
          amount_paid: remaining_amount,
          balance: monthly_amount - remaining_amount,
          status: 'paid',
        },
      )
    end
    statement_details
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  # Unpaid Statement details of payment plan.
  #
  # @param [PaymentPlan] plan
  #
  # @return [Array]
  # rubocop:disable Metrics/MethodLength
  def unpaid_statement_details(plan)
    unpaid_installments = (plan.pending_balance / plan.monthly_amount).floor
    due_date = plan.start_date + (plan.duration_in_month - unpaid_installments).month
    statement_details = []
    unpaid_installments.times do |_installment|
      statement_details.push(
        {
          due_date: due_date,
          amount_paid: 0,
          balance: plan.monthly_amount,
          status: 'unpaid',
        },
      )
      due_date += 1.month
    end
    statement_details
  end
  # rubocop:enable Metrics/MethodLength

  # Details of payment made against PaymentPlan
  #
  # @param [Array] Collection of PlanPayment
  #
  # @return [Array]
  def plan_payment_details(plan_payments)
    plan_payments.not_cancelled
                 .joins(:user_transaction)
                 .order(:created_at)
                 .select(:amount, :created_at, 'transactions.transaction_number')
  end
end
# rubocop:enable Metrics/ModuleLength

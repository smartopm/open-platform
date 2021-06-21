# frozen_string_literal: true

# Payment queries
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
    payment_plans = user.payment_plans.includes(:plan_payments)

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
      statements: statements(payment_plan),
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
  #
  # @param [PaymentPlan] plan
  #
  # @return [Array]
  def statements(plan)
    payments = plan.plan_payments.not_cancelled.order(:created_at)
    statement_details = []
    unallocated_amount = 0

    payments.each do |payment|
      installment = installment_detail(payment, unallocated_amount)
      statement_details << installment
      unallocated_amount = installment[:unallocated_amount]
    end
    statement_details
  end

  # rubocop:disable Metrics/MethodLength
  # Return installment details
  #
  # @param payment [PlanPayment]
  # @param unallocated_amount [Float]
  #
  # @return [Hash]
  def installment_detail(payment, unallocated_amount)
    monthly_amount = payment.payment_plan.monthly_amount
    available_amount = payment.amount + unallocated_amount
    settled_installments = (available_amount / monthly_amount).floor
    debit_amount = monthly_amount * settled_installments

    {
      receipt_number: payment.receipt_number,
      payment_date: payment.created_at,
      amount_paid: payment.amount,
      installment_amount: monthly_amount,
      settled_installments: settled_installments,
      debit_amount: debit_amount,
      unallocated_amount: available_amount - debit_amount,
    }
  end
  # rubocop:enable Metrics/MethodLength
end

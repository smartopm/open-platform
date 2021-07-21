# frozen_string_literal: true

# Payment queries
module Types::Queries::PaymentPlan
  extend ActiveSupport::Concern

  included do
    field :user_plans_with_payments, [Types::PaymentPlanType], null: true do
      description 'return payment plans with payments for user'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :payment_plan_statement, Types::PaymentPlanDetailType, null: true do
      description 'Fetch statements of payment plan'
      argument :payment_plan_id, GraphQL::Types::ID, required: true
    end

    field :user_payment_plans, [Types::PaymentPlanType], null: true do
      description 'returns payment plans for user'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  # Returns list of user's all payment plans with payments
  #
  # @param user_id [String]
  # @param offset [Integer]
  # @param limit [Integer]
  #
  # @return [Array<PaymentPlan>]
  def user_plans_with_payments(user_id: nil, offset: 0, limit: 10)
    user = verified_user(user_id)
    payment_plans = Properties::PaymentPlan
                    .left_joins(:plan_ownerships).where(
                      'payment_plans.user_id = ? or plan_ownerships.user_id = ?', user.id,
                      user.id
                    ).distinct

    if context[:current_user].admin?
      payment_plans.order(created_at: :desc).offset(offset).limit(limit)
    else
      payment_plans.where.not(plan_payments: { status: :cancelled }).order(
        created_at:
        :desc,
      ).offset(offset).limit(limit)
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  # Statement details of payment plan
  #
  # @param [String] PaymentPlan#id
  #
  # @return [Hash]
  def payment_plan_statement(payment_plan_id:)
    raise_unauthorized_error

    payment_plan = Properties::PaymentPlan.find_by(id: payment_plan_id)
    raise_payment_plan_not_found_error(payment_plan)

    {
      payment_plan: payment_plan,
      statements: statements(payment_plan),
    }
  end

  # Returns list of user's all payment plans
  #
  # @param user_id [String]
  # @param offset [Integer]
  # @param limit [Integer]
  #
  # @return [Array<PaymentPlan>]
  def user_payment_plans(user_id: nil, offset: 0, limit: 10)
    raise_unauthorized_error

    user = context[:site_community].users.find_by(id: user_id)
    user.payment_plans.includes(:land_parcel).limit(limit).offset(offset)
  end

  private

  # Raises GraphQL execution error if user is unauthorized.
  #
  # @return [GraphQL::ExecutionError]
  def raise_unauthorized_error
    return if context[:current_user]&.admin?

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end

  # Raises GraphQL execution error if payment plan does not exist.
  #
  # @return [GraphQL::ExecutionError]
  def raise_payment_plan_not_found_error(payment_plan)
    return if payment_plan

    raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
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
    installment_amount = payment.payment_plan.installment_amount
    available_amount = payment.amount + unallocated_amount
    settled_installments = (available_amount / installment_amount).floor
    debit_amount = installment_amount * settled_installments

    {
      receipt_number: payment.receipt_number,
      payment_date: payment.created_at,
      amount_paid: payment.amount,
      installment_amount: installment_amount,
      settled_installments: settled_installments,
      debit_amount: debit_amount,
      unallocated_amount: available_amount - debit_amount,
    }
  end
  # rubocop:enable Metrics/MethodLength
end

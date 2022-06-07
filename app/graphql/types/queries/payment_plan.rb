# frozen_string_literal: true

# Payment queries
# rubocop:disable Metrics/ModuleLength
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

    field :community_payment_plans, [Types::PaymentPlanType], null: true do
      description 'returns all payment plans for community'
      argument :query, String, required: false
    end

    field :user_general_plan, Types::PaymentPlanType, null: true do
      description 'returns general plan for user'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  # Returns list of user's all payment plans with payments
  #
  # @param user_id [String]
  # @param offset [Integer]
  # @param limit [Integer]
  #
  # @return [Array<PaymentPlan>]
  def user_plans_with_payments(user_id: nil, offset: 0, limit: 10)
    user = verified_user(user_id)
    Properties::PaymentPlan.left_joins(:plan_ownerships).includes(:land_parcel, plan_payments:
      :user_transaction).where(
        'payment_plans.user_id = ? or plan_ownerships.user_id = ?', user.id,
        user.id
      ).distinct.order(created_at: :desc).offset(offset).limit(limit)
  end

  # Statement details of payment plan
  #
  # @param [String] PaymentPlan#id
  #
  # @return [Hash]
  def payment_plan_statement(payment_plan_id:)
    raise_unauthorized_error_for_payment_plans(:can_fetch_plan_statement)

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
    raise_unauthorized_error_for_payment_plans(:can_fetch_user_payment_plans)

    user = context[:site_community].users.find_by(id: user_id)
    user.payment_plans.includes(:land_parcel).where.not(pending_balance: 0).limit(limit)
        .offset(offset)
  end

  # Returns list of all communiy's payment plans
  #
  # @return [Array<PaymentPlan>]
  def community_payment_plans(query: nil)
    raise_unauthorized_error_for_payment_plans(:can_fetch_community_payment_plans)

    plans = Properties::PaymentPlan.excluding_general_plans
                                   .includes(:land_parcel, :user, :plan_payments)
                                   .where(land_parcels:
                                      { community_id: context[:site_community].id })
                                   .order(:status)
    filtered_plans(plans, query).sort_by { |plan| [(plan.owing_amount * -1), plan.status] }
  end

  # Returns user's general payment plan
  #
  # @return PaymentPlan
  def user_general_plan(user_id: nil)
    user = verified_user(user_id)
    user.payment_plans.general.includes(plan_payments: :user_transaction).first
  end

  private

  # Raises GraphQL execution error if user is unauthorized.
  #
  # @return [GraphQL::ExecutionError]
  def raise_unauthorized_error_for_payment_plans(permission)
    return true if permitted?(module: :payment_plan, permission: permission)

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

  # Returns filtered payment plans based on query
  #
  # @return [Array<PaymentPlan>]
  def filtered_plans(plans, query)
    split_query = query&.split(' ')
    if query_for_filter?(split_query)
      selected_plans(plans, split_query)
    else
      plans.search(query)
    end
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  # Returns selected plans by using the instance methods
  #
  # @return [Array<PaymentPlan>]
  def selected_plans(plans, split_query)
    method, operator, value = split_query
    value = value.gsub("'", '')
    value = value.to_f unless method.eql?('plan_status')

    if method.eql?('plan_status') && value.eql?('upcoming')
      plans.select do |plan|
        plan.plan_status.eql?('on_track') &&
          plan.upcoming_installment_due_date >= Time.zone.today &&
          plan.upcoming_installment_due_date <= 30.days.from_now.to_date
      end
    else
      plans.select { |plan| plan.public_send(method).public_send(get_operator(operator), value) }
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity

  # Returns true/false if query is for filter
  # * Checks if query is in the format: 'field operator value'
  #
  # @return [Boolean]
  def query_for_filter?(split_query)
    return false if split_query&.size != 3

    methods = %w[owing_amount installments_due plan_status]
    operators = %w[< > :]

    return true if methods.include?(split_query[0]) && operators.include?(split_query[1])
  end

  # Returns the operator
  #
  # @return [String]
  def get_operator(operator)
    return operator unless operator.eql?(':')

    '=='
  end
  # rubocop:enable Metrics/MethodLength
end
# rubocop:enable Metrics/ModuleLength

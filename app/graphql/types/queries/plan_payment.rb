# frozen_string_literal: true

# PlanPayment queries
module Types::Queries::PlanPayment
  extend ActiveSupport::Concern

  included do
    # Get payments list
    field :payments_list, [Types::PlanPaymentType], null: true do
      description 'Get list of all payments - plan payments'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end
    field :payment_receipt, Types::PlanPaymentType, null: true do
      description 'Fetches payment receipt details'
      argument :id, GraphQL::Types::ID, required: true
    end

    field :payment_stat_details, [Types::PlanPaymentType], null: true do
      description 'Get list of all transactions in a particular day'
      argument :query, String, required: false
    end
  end

  # Returns list of all payments
  #
  # @param query [String]
  # @param offset [Integer]
  # @param limit [Integer]
  #
  # @return [Array<PlanPaymentType>]
  def payments_list(query: nil, limit: 100, offset: 0)
    unless context[:current_user]&.admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    search_method = 'search'
    if query && !query.include?(':') && query.to_i > 0
      search_method = 'search_by_numbers'
    end

    context[:site_community].plan_payments.send(search_method, query)
                            .eager_load(:user, :payment_plan)
                            .order(created_at: :desc)
                            .limit(limit).offset(offset)
  end

  # Payment's receipt details.
  #
  # @param id [String]
  #
  # @return [PlanPayment]
  def payment_receipt(id:)
    payment = context[:site_community].plan_payments.find_by(id: id)
    raise_payment_not_found_error(payment)

    payment
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def payment_stat_details(query:)
    payments = context[:site_community].plan_payments
                                       .not_cancelled
                                       .eager_load(:user)
    case query
    when 'today'
      payments.where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)
    when 'oneWeek'
      payments.where(created_at: 1.week.ago..Time.zone.now.end_of_day)
    when 'oneMonth'
      payments.where(created_at: 30.days.ago..Time.zone.now.end_of_day)
    when 'overOneMonth'
      payments.where(created_at: 1.year.ago..Time.zone.now.end_of_day)
    else
      converted_date = Date.parse(query).in_time_zone(context[:site_community].timezone).all_day
      payments.where(created_at: converted_date)
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  private

  # Raises GraphQL execution error if payment does not exist.
  #
  # @return [GraphQL::ExecutionError]
  def raise_payment_not_found_error(payment)
    return if payment

    raise GraphQL::ExecutionError, I18n.t('errors.plan_payment.not_found')
  end
end

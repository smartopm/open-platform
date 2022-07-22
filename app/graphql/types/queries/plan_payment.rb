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
      argument :user_id, GraphQL::Types::ID, required: true
      argument :id, GraphQL::Types::ID, required: true
    end

    field :payment_stat_details, [Types::PlanPaymentType], null: true do
      description 'Get list of all payments in a particular day'
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
    raise_unauthorized_error_for_plan_payments(:can_fetch_payments_list)

    search_method = 'search'
    search_method = 'search_by_numbers' if query_is_number?(query)
    context[:site_community].plan_payments
                            .exluding_general_payments
                            .send(search_method, filtered_query(query))
                            .order(created_at: :desc)
                            .limit(limit).offset(offset)
  end

  # Payment's receipt details.
  #
  # @param id [String]
  #
  # @return [PlanPayment]
  def payment_receipt(user_id:, id:)
    user = verified_user(user_id)
    payment = user.plan_payments.find_by(id: id)
    raise_payment_not_found_error(payment)

    payment
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def payment_stat_details(query:)
    raise_unauthorized_error_for_plan_payments(:can_fetch_payment_stat_details)

    payments = context[:site_community].plan_payments
                                       .exluding_general_payments
                                       .not_cancelled
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

  # Raises GraphQL execution error if user is unauthorized.
  #
  # @return [GraphQL::ExecutionError]
  def raise_unauthorized_error_for_plan_payments(permission)
    return true if permitted?(module: :plan_payment, permission: permission)

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end

  # Raises GraphQL execution error if payment does not exist.
  #
  # @return [GraphQL::ExecutionError]
  def raise_payment_not_found_error(payment)
    return if payment

    raise GraphQL::ExecutionError, I18n.t('errors.plan_payment.not_found')
  end

  # Checks whether the query is a positive number
  #
  # @return [Boolean]
  def query_is_number?(query)
    return true if query&.exclude?(':') && query.to_i.positive? && get_date(query).nil?
  end

  # Returns the updated query for the range to include the end date when searching in DB
  #
  # @return [String]
  def filtered_query(query)
    return query unless query&.include?('>=')

    split_query = query.split(' ')
    end_date = get_date(split_query.last)
    return query if end_date.nil?

    split_query[-1] = end_date.to_datetime.end_of_day.to_s
    split_query.join(' ')
  end

  # Returns the parsed date if valid or returns nil
  #
  # @returns [Date]
  def get_date(query)
    Date.parse(query)
  rescue StandardError
    nil
  end
end

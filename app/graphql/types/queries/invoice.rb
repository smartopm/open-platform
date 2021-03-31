# frozen_string_literal: true

# invoice queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::Invoice
  extend ActiveSupport::Concern
  # rubocop:disable Metrics/BlockLength
  included do
    # Get invoices
    field :invoices, [Types::InvoiceType], null: true do
      description 'Get all invoices'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    # Get invoices and transaction
    field :invoices_with_transactions, Types::InvoiceTransactionType, null: true do
      description 'Get all invoices for a user and all associated transactions'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get invoice by id
    field :invoice, Types::InvoiceType, null: true do
      description 'Get invoice by its id'
      argument :id, GraphQL::Types::ID, required: true
    end
    # Get invoice by for a user
    field :user_invoices, [Types::InvoiceType], null: true do
      description 'Get invoice for a user'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
    # Get pending invoice by for a user
    field :pending_invoices, [Types::PendingInvoiceType], null: true do
      description 'Get pending invoices for a user'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get paid invoices by payment plan id
    field :paid_invoices_by_plan, [Types::InvoiceType], null: true do
      description 'Get paid invoices for a user by payment plan'
      argument :payment_plan_id, GraphQL::Types::ID, required: true
    end

    field :invoice_stats, Types::InvoiceStatType, null: false do
      description 'return stats based on status of invoices'
    end

    field :invoice_autogeneration_data, Types::InvoiceAutogenerationDataType, null: false do
      description 'returns stats for monthly invoice autogeneration'
    end

    field :invoice_accounting_stats, [Types::InvoiceAccountingStatType], null: false do
      description 'return stats of all unpaid invoices'
    end

    field :invoices_stat_details, [Types::InvoiceType], null: false do
      argument :query, GraphQL::Types::String, required: true
      description 'return list of all unpaid invoices'
    end
  end
  # rubocop:enable Metrics/BlockLength
  def invoices(query: nil, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    context[:site_community].invoices
                            .search(query)
                            .eager_load(:land_parcel, :user, :payments)
                            .order(due_date: :desc)
                            .limit(limit)
                            .offset(offset)
  end

  def invoice(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].nil?

    context[:site_community].invoices.find(id)
  end

  # rubocop:disable Metrics/AbcSize
  def user_invoices(user_id:, offset: 0, limit: 100)
    user = verified_user(user_id)

    user.invoices.eager_load(:land_parcel, :payments)
        .order(created_at: :desc).limit(limit).offset(offset)
  end

  def invoices_with_transactions(user_id:, _offset: 0, _limit: 100)
    user = verified_user(user_id)

    {
      invoices: user.invoices.eager_load(:land_parcel, :payments).reverse,
      payments: user.invoices.map(&:payments).flatten,
      payment_plans: user.payment_plans,
    }
  end

  def pending_invoices(user_id:)
    user = verified_user(user_id)

    cumulate_pending_balance(user.invoices.where('pending_amount > ?', 0))
  end

  def paid_invoices_by_plan(payment_plan_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    plan = ::PaymentPlan.find(payment_plan_id)
    plan.invoices.paid
  end

  # rubocop:disable Metrics/MethodLength
  def invoices_stat_details(query:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

    invoices = context[:site_community].invoices.eager_load(:user, :land_parcel)
    case query
    when '00-30'
      invoices.not_paid.where('due_date >= ?', 30.days.ago)
    when '31-45'
      invoices.not_paid.where('due_date <= ? AND due_date >= ?', 31.days.ago, 45.days.ago)
    when '46-60'
      invoices.not_paid.where('due_date <= ? AND due_date >= ?', 46.days.ago, 60.days.ago)
    else
      invoices.not_paid.where('due_date <= ?', 61.days.ago)
    end
  end
  # rubocop:enable Metrics/MethodLength

  def invoice_stats
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    invoices = context[:site_community].invoices
    {
      late: invoices.late.count,
      paid: invoices.paid.count,
      in_progress: invoices.in_progress.count,
      cancelled: invoices.cancelled.count,
    }
  end

  def invoice_autogeneration_data
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    month = Time.zone.now.month
    payment_plans = ::PaymentPlan.where(
      'extract(month from start_date) = ? AND generated = ?', month, false
    )
    {
      number_of_invoices: payment_plans.count,
      total_amount: calculate_total_amount(payment_plans),
    }
  end

  def invoice_accounting_stats
    Invoice.invoice_stat(context[:site_community].id)
  end

  # It would be good to put this elsewhere to use it in other queries

  def verified_user(user_id)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].nil?
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.id == user_id ||
                                                         context[:current_user].admin?

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    user
  end

  def cumulate_pending_balance(invoices)
    balance = 0
    pending_invoices = []
    invoices.reverse.each do |invoice|
      invoice_data = invoice.attributes
      balance += invoice.pending_amount
      invoice_data['balance'] = balance
      pending_invoices.push(invoice_data)
    end
    pending_invoices
  end
  # rubocop:enable Metrics/AbcSize

  def calculate_total_amount(payment_plans)
    amount = 0
    payment_plans.each do |payment_plan|
      next if payment_plan.total_amount.nil?

      amount += ((payment_plan.percentage.to_i * payment_plan.total_amount) / 12)
    end
    amount
  end
end
# rubocop:enable Metrics/ModuleLength

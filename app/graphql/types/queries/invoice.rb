# frozen_string_literal: true

# invoice queries
module Types::Queries::Invoice
  extend ActiveSupport::Concern
  # rubocop:disable Metrics/BlockLength
  included do
    # Get invoices
    field :invoices, [Types::InvoiceType], null: true do
      description 'Get all invoices'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :status, String, required: false
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

    field :invoice_stats, Types::InvoiceStatType, null: false do
      description 'return stats based on status of invoices'
    end
  end
  # rubocop:enable Metrics/BlockLength

  def invoices(status: nil, query: nil, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    context[:site_community].invoices
                            .search(query)
                            .by_status(status)
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
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].nil?
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].id == user_id ||
                                                         context[:current_user].admin?

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    user.invoices.eager_load(:land_parcel, :payments)
        .order(created_at: :desc).limit(limit).offset(offset)
  end

  def invoices_with_transactions(user_id:, _offset: 0, _limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         context[:current_user]&.id == user_id

    user = User.allowed_users(context[:current_user]).find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    {
      invoices: user.invoices,
      payments: user.invoices.map(&:payments).flatten,
    }
  end

  def pending_invoices(user_id:, offset: 0, limit: 100)
    user = verified_user(user_id)

    cumulate_pending_balance(user.invoices.where('pending_amount > ?', 0))
  end

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

  # It would be good to put this elsewhere to use it in other queries

  def verified_user(user_id)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].id == user_id ||
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
end

# frozen_string_literal: true

# invoice queries
module Types::Queries::Invoice
  extend ActiveSupport::Concern

  included do
    # Get invoices
    field :invoices, [Types::InvoiceType], null: true do
      description 'Get all invoices'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :status, String, required: false
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

    field :invoice_stats, Types::InvoiceStatType, null: false do
      description 'return stats based on status of invoices'
    end
  end

  def invoices(status: nil, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    context[:site_community].invoices
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

  def invoice_stats
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    invoinces = context[:site_community].invoices
    {
      late: invoinces.by_status('late').count,
      paid: invoinces.by_status('paid').count,
      in_progress: invoinces.by_status('in_progress').count,
      cancelled: invoinces.by_status('cancelled').count,
    }
  end
  # rubocop:enable Metrics/AbcSize
end

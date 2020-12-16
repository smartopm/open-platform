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
    end

    # Get invoice by id
    field :invoice, Types::InvoiceType, null: true do
      description 'Get nvoice by its id'
      argument :id, GraphQL::Types::ID, required: true
    end
  end

  def invoices(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].nil?

    context[:site_community].invoices
                            .order(due_date: :desc)
                            .limit(limit)
                            .offset(offset)
  end

  def invoice(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].nil?

    context[:site_community].invoices.find(id)
  end
end

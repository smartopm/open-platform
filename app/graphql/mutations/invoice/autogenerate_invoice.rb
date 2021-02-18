# frozen_string_literal: true

module Mutations
  module Invoice
    # Create a new Invoice
    class AutogenerateInvoice < BaseMutation
      field :invoices, [Types::InvoiceType], null: true

      def resolve
        month = Time.zone.now.month
        payment_plans = ::PaymentPlan.where("extract(month from start_date) = ?", month)
        invoices = []
        payment_plans.each do |payment_plan|
          land_parcel = payment_plan.land_parcel
          valuation = land_parcel.valuations&.where('start_date <= ?', Time.zone.now)&.first
          next if valuation.nil?

          inv = payment_plan.user.invoices.create({
            land_parcel: land_parcel,
            amount: ((payment_plan.percentage.to_i * valuation.amount) / 12),
            community: context[:site_community]
          })

          raise GraphQL::ExecutionError, inv.errors.full_messages unless inv.persisted?
          invoices.push(inv)
        end

        { invoices: invoices } 
      end

      def authorized?
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end

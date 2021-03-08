# frozen_string_literal: true

module Mutations
  module Invoice
    # Create a new Invoice
    class AutogenerateInvoice < BaseMutation
      field :invoices, [Types::InvoiceType], null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve
        month = Time.zone.now.month
        payment_plans = ::PaymentPlan.where(
          'extract(month from start_date) = ? AND generated = ?', month, false
        )
        invoices = []
        payment_plans.each do |payment_plan|
          land_parcel = payment_plan.land_parcel
          valuation = land_parcel.valuations&.latest
          next if valuation.nil?

          inv = create_invoice(payment_plan, land_parcel, valuation)
          raise GraphQL::ExecutionError, inv.errors.full_messages unless inv.persisted?

          payment_plan.update(generated: true)
          invoices.push(inv)
        end
        { invoices: invoices }
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def create_invoice(payment_plan, land_parcel, valuation)
        amount = ((payment_plan.percentage.to_i * valuation.amount) / 12)
        payment_plan.invoices.create({
                                        land_parcel: land_parcel,
                                        amount: amount,
                                        community: context[:site_community],
                                        autogenerated: true,
                                        status: 'in_progress',
                                        due_date: 1.year.from_now,
                                        user: payment_plan.user
                                      })
      end

      def authorized?
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end

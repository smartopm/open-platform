# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Create a new request/pending member
    class GuestEntryRequestCreate < BaseMutation
      argument :name, String, required: true
      argument :email, String, required: false
      argument :nrc, String, required: false
      argument :phone_number, String, required: false
      argument :vehicle_plate, String, required: false
      argument :reason, String, required: false
      argument :other_reason, String, required: false
      argument :concern_flag, GraphQL::Types::Boolean, required: false
      argument :source, String, required: false
      argument :visitation_date, String, required: false
      argument :start_time, String, required: false
      argument :end_time, String, required: false
      argument :company_name, String, required: false
      argument :occurs_on, [String], required: false
      argument :visit_end_date, String, required: false
      argument :is_guest, Boolean, required: false

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        user = context[:current_user]
        ActiveRecord::Base.transaction do
          request = user.entry_requests.create!(vals)
          raise GraphQL::ExecutionError, request.errors.full_messages unless request.persisted?

          { entry_request: request }
        end
      end

      def authorized?(_vals)
        return true if context[:current_user]&.role?(%i[custodian admin client resident])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

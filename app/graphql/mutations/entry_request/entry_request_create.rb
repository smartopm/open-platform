# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Create a new request/pending member
    class EntryRequestCreate < BaseMutation
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
      argument :starts_at, String, required: false
      argument :ends_at, String, required: false
      argument :company_name, String, required: false
      argument :temperature, String, required: false
      argument :occurs_on, [String], required: false
      argument :visit_end_date, String, required: false
      argument :is_guest, Boolean, required: false
      argument :guest_id, ID, required: false

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        user = context[:current_user]
        ActiveRecord::Base.transaction do
          request = user.entry_requests.create!(vals.except(:temperature))
          # make it compatible with previous temp recording
          data = { ref_name: vals[:name], note: vals[:temperature] }

          raise GraphQL::ExecutionError, request.errors.full_messages unless request.persisted?

          user.generate_events('user_temp', request, data) if vals[:temperature].present?
          { entry_request: request }
        end
      end

      # Verifies if current user admin or security guard.
      def authorized?(_vals)
        return true if permitted?(module: :entry_request, permission: :can_create_entry_request)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

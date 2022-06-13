# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Grant an entry request
    class EntryRequestGrant < BaseMutation
      argument :id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true
      field :status, String, null: true

      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        ActiveRecord::Base.transaction do
          entry_request = Logs::EntryRequest.find_by(id: vals[:id])
          raise_request_not_found_error(entry_request)

          if entry_request.guest&.deactivated?
            entry_request.deny!(context[:current_user])
            return { status: 'denied' }
          end

          entry_request.grant!(context[:current_user])
          phone_number = entry_request.phone_number
          entry_request.send_feedback_link(phone_number) if phone_number
          { entry_request: entry_request, status: 'success' }
        end
      end
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user can perform current action
      def authorized?(_vals)
        return true if permitted?(module: :entry_request, permission: :can_grant_entry)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      def raise_request_not_found_error(entry_request)
        return unless entry_request.nil?

        raise GraphQL::ExecutionError, I18n.t('errors.entry_request.not_found')
      end
    end
  end
end

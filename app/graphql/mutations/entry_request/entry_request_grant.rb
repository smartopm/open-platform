# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Grant an entry request
    class EntryRequestGrant < BaseMutation
      argument :id, ID, required: true

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        ActiveRecord::Base.transaction do
          entry_request = context[:current_user].grant!(vals[:id])

          if entry_request.nil?
            raise GraphQL::ExecutionError, I18n.t('errors.entry_request.not_found')
          end

          phone_number = entry_request.phone_number
          entry_request.send_feedback_link(phone_number) if phone_number
          { entry_request: entry_request }
        end
      end

      # TODO: Better auth here
      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]&.role?(%i[security_guard admin])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

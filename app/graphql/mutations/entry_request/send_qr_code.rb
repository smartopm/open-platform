# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Send qr-code to a guest
    class SendQrCode < BaseMutation
      argument :id, ID, required: true
      argument :guest_email, String, required: true

      field :message, String, null: false

      def resolve(vals)
        entry_request = Logs::EntryRequest.find(vals[:id])
        raise GraphQL::ExecutionError, I18n.t('errors.not_found') unless entry_request

        GuestQrCodeJob.perform_now(
          community: context[:site_community],
          request_data: [{user: entry_request.user, request: entry_request }],
          type: 'scan',
        )

        { message: 'success' }
      end

      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

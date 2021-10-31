# frozen_string_literal: true

module Mutations
  module EntryRequest
    # update an invitation
    class InvitationUpdate < BaseMutation
      argument :guest_id, ID, required: true
      argument :visitation_date, String, required: false
      argument :starts_at, String, required: false
      argument :ends_at, String, required: false
      argument :occurs_on, [String], required: false
      argument :visit_end_date, String, required: false

      field :entry_time, Types::EntryTimeType, null: true

      def resolve(vals)
        invite = context[:current_user].invites.find_by(guest_id: vals[:guest_id])
        raise GraphQL::ExecutionError, I18n.t('errors.not_found') if invite.nil?

        unless invite.entry_time.update(vals.except(:guest_id))
          raise GraphQL::ExecutionError, invite.errors.full_messages
        end

        { entry_time: invite.entry_time }
      end

      # Verifies if current user admin or security guard.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(
          module: :entry_request,
          permission: :can_create_entry_request,
        ) || context[:current_user]&.role?(%i[security_guard admin custodian client resident])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

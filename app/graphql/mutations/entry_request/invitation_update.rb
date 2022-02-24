# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Update entry time for invite
    class InvitationUpdate < BaseMutation
      argument :invite_id, ID, required: true
      argument :visitation_date, String, required: false
      argument :starts_at, String, required: false
      argument :ends_at, String, required: false
      argument :occurs_on, [String], required: false
      argument :visit_end_date, String, required: false
      argument :status, String, required: false

      field :success, GraphQL::Types::Boolean, null: true

      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        invite = context[:current_user].invitees.find_by(id: vals[:invite_id])
        return if invite.nil?

        update_invite(invite, vals[:status])
        entry_time = invite.entry_time
        if entry_time.present?
          update_entry_time(entry_time, vals.except(:invite_id, :status))
        else
          create_entry_time(vals, invite)
        end
        { success: true }
      end

      def update_invite(invite, status)
        return if invite.update(status: status)

        raise GraphQL::ExecutionError, invite.errors.full_message
      end

      def update_entry_time(entry_time, vals)
        return if entry_time.update(vals)

        raise GraphQL::ExecutionError, entry_time.errors.full_message
      end

      def create_entry_time(vals, invite)
        entry_time = context[:site_community].entry_times.create(
          visitation_date: vals[:visitation_date],
          starts_at: vals[:starts_at],
          ends_at: vals[:ends_at],
          occurs_on: vals[:occurs_on],
          visit_end_date: vals[:visit_end_date],
          visitable_id: invite.id,
          visitable_type: 'Logs::Invite',
        )

        return if entry_time.persisted?

        raise GraphQL::ExecutionError, entry_time.errors.full_message
      end

      # rubocop:enable Metrics/MethodLength
      def authorized?(_vals)
        return true if permitted?(module: :entry_request, permission: :can_update_invitation)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

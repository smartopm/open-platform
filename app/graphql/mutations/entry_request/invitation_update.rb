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

        ActiveRecord::Base.transaction do
          invite.update!(status: vals[:status])
          entry_time = invite.entry_time

          if entry_time.present?
            entry_time.update!(vals.except(:invite_id, :status))
          else
            create_entry_time(vals, invite)
          end
          { success: true }
        end
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end

      def create_entry_time(vals, invite)
        context[:site_community].entry_times.create!(
          visitation_date: vals[:visitation_date],
          starts_at: vals[:starts_at],
          ends_at: vals[:ends_at],
          occurs_on: vals[:occurs_on],
          visit_end_date: vals[:visit_end_date],
          visitable_id: invite.id,
          visitable_type: 'Logs::Invite',
        )
      end

      # rubocop:enable Metrics/MethodLength
      def authorized?(_vals)
        return true if permitted?(module: :entry_request, permission: :can_update_invitation)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

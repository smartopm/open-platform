# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Create a new entry time
    class InvitationCreate < BaseMutation
      argument :guest_id, ID, required: false
      argument :name, String, required: false
      argument :phone_number, String, required: false
      argument :email, String, required: false
      argument :visitation_date, String, required: true
      argument :starts_at, String, required: false
      argument :ends_at, String, required: false
      argument :occurs_on, [String], required: false
      argument :visit_end_date, String, required: false

      field :entry_time, Types::EntryTimeType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        ActiveRecord::Base.transaction do
          user = context[:site_community].users.find_by(id: vals[:guest_id])
          raise_duplicate_email_error(vals[:email])
          raise_duplicate_number_error(vals[:phone_number])

          guest = check_or_create_guest(vals, user)
          request = generate_request(vals, guest)
          invite = context[:current_user].invite_guest(guest.id)

          entry = generate_entry_time(vals.except(:guest_id, :name, :phone_number, :email), invite)
          GuestQrCodeJob.perform_now(context[:current_user], guest.email, request, 'verify')
          return { entry_time: entry } if entry

        rescue ActiveRecord::RecordNotUnique
          raise GraphQL::ExecutionError, I18n.t('errors.duplicate.guest')
        end

        # raise GraphQL::ExecutionError, entry_time.errors.full_messages
      end

      def generate_entry_time(vals, invite)
        return if invite.nil?

        invitation = context[:current_user].invitees.find_by(id: invite.id)

        unless invitation.entry_time.nil?
          invitation.entry_time.update!(vals)
          return invitation.entry_time
        end

        return invitation.entry_time.update!(vals) unless invitation.entry_time.nil?

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
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def generate_request(vals, guest)
        return if guest.nil?

        req = context[:site_community].entry_requests.find_by(guest_id: guest.id)
        return req unless req.nil?

        context[:current_user].entry_requests.create!(
          guest_id: guest.id,
          **vals.except(:guest_id), # specify only the fields we need here
        )
      end

      # TODO: find out how to re-use validation in create mutation
      def check_or_create_guest(vals, user)
        return user unless user.nil?

        context[:current_user].enroll_user(
          name: vals[:name],
          phone_number: vals[:phone_number],
          email: vals[:email],
          user_type: 'visitor',
        )
      end

      # Verifies if current user admin or security guard.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(
          module: :entry_request,
          permission: :can_invite_guest,
        ) || context[:current_user]&.role?(%i[security_guard admin custodian client resident])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

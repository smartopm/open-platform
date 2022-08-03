# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Create a new entry time
    class InvitationCreate < BaseMutation
      argument :visitation_date, String, required: true
      argument :starts_at, String, required: false
      argument :ends_at, String, required: false
      argument :occurs_on, [String], required: false
      argument :visit_end_date, String, required: false
      argument :user_ids, [String], required: false
      argument :guests, [GraphQL::Types::JSON], required: false

      field :success, GraphQL::Types::Boolean, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        ActiveRecord::Base.transaction do
          visitors_ids = []

          vals[:guests].each do |guest|
            user = check_or_create_guest(guest)
            visitors_ids << user.id
          end

          all_users_ids = visitors_ids + vals[:user_ids]
          users_info = []
          all_users_ids.each do |id|
            user = context[:site_community].users.find_by(id: id)
            request = generate_request(vals, user)
            invite = context[:current_user].invite_guest(user.id, request.id)
            generate_entry_time(vals.except(:guests, :user_ids), invite)
            users_info << { user: user, request: request }
          end

          GuestQrCodeJob.perform_now(
            community: context[:site_community],
            request_data: users_info,
            type: 'verify',
          )
          return { success: true }
        end
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
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize

      def generate_request(vals, guest)
        return if guest.nil?

        req = context[:site_community].entry_requests.find_by(guest_id: guest.id)
        return req unless req.nil?

        context[:current_user].entry_requests.create!(
          guest_id: guest.id,
          name: guest.name,
          company_name: guest.name,
          phone_number: guest.phone_number,
          **vals.except(:user_ids, :guests),
        )
      end

      def check_or_create_guest(user)
        raise_duplicate_number_error(user[:phone_number])

        enrolled_user = context[:current_user].enroll_user(
          name: user['companyName'].presence || "#{user['firstName']} #{user['lastName']}",
          phone_number: user['phoneNumber'],
          user_type: 'visitor',
        )
        return enrolled_user if enrolled_user.persisted?

        raise GraphQL::ExecutionError, enrolled_user.errors.full_messages&.join(', ')
      end

      def authorized?(_vals)
        return true if permitted?(module: :entry_request, permission: :can_invite_guest)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

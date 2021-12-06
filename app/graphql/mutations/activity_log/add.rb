# frozen_string_literal: true

require 'host_env'

module Mutations
  module ActivityLog
    # Add an activity log for a user
    class Add < BaseMutation
      argument :user_id, ID, required: true
      argument :note, String, required: false
      argument :timestamp, String, required: false
      argument :digital, Boolean, required: false
      argument :subject, String, required: false

      field :user, Types::UserType, null: true
      field :event_log, Types::EventLogType, null: true

      def resolve(user_id:, note: nil, timestamp: nil, digital: nil, subject: 'user_entry')
        user = Users::User.find(user_id)
        raise_user_not_found_error(user)

        ActiveRecord::Base.transaction do
          associate_with_entry_request(user)
          event_log = instantiate_event_log(user, note, timestamp, digital, subject)

          send_notifications(user)
          return { event_log: event_log, user: user } if event_log.save

          raise GraphQL::ExecutionError, event_log.errors.full_messages
        end
      end

      def instantiate_event_log(user, note, timestamp, digital, subject)
        context[:current_user].generate_events(subject, user, ref_name: user.name, note: note,
                                                              type: user.user_type,
                                                              timestamp: timestamp,
                                                              digital: digital)
      end

      def send_notifications(user)
        number = user.phone_number
        feedback_link = "https://#{HostEnv.base_url(user.community)}/feedback"
        return if number.nil?

        # disabled rubocop to keep the structure of the message
        Sms.send(number, I18n.t('general.thanks_for_using_our_app', feedback_link: feedback_link))
      end

      # create an entry if it doesnt exit
      # if an entry exist mark it as granted_access
      # avoid duplicate events
      def associate_with_entry_request(user)
        grantor = context[:current_user]
        req = context[:site_community].entry_requests.find_by(guest_id: user.id)
        return req.grant!(grantor, 'no_event') if req.present?

        grantor.entry_requests.create!(
          name: user.name,
          guest_id: user.id,
          granted_at: Time.zone.now,
          grantor_id: grantor.id,
          granted_state: 3,
        )
      end

      # TODO: Better auth here
      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if user does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_user_not_found_error(user)
        return if user

        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found')
      end
    end
  end
end

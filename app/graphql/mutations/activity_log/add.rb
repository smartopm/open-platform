# frozen_string_literal: true

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
        user = ::User.find(user_id)
        raise GraphQL::ExecutionError, 'User not found' unless user

        event_log = instantiate_event_log(user, note, timestamp, digital, subject)

        send_notifications(user.phone_number)
        return { event_log: event_log, user: user } if event_log.save

        raise GraphQL::ExecutionError, event_log.errors.full_messages
      end

      def instantiate_event_log(user, note, timestamp, digital, subject)
        context[:current_user].generate_events(subject, user, ref_name: user.name, note: note,
                                                              type: user.user_type,
                                                              timestamp: timestamp,
                                                              digital: digital)
      end

      def send_notifications(number)
        feedback_link = "https://#{ENV['HOST']}/feedback"
        return if number.nil?

        # disabled rubocop to keep the structure of the message
        # rubocop:disable LineLength
        Sms.send(number, "Thank you for using our app, kindly use this link to give us feedback #{feedback_link}")
        # rubocop:enable LineLength
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end

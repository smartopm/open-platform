# frozen_string_literal: true

module Mutations
  module Message
    # Create Message
    class MessageCreate < BaseMutation
      argument :receiver, String, required: false
      argument :message, String, required: true
      argument :user_id, ID, required: true
      argument :note_id, ID, required: false

      field :message, Types::MessageType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        message = context[:current_user].construct_message(vals)
        message.category = 'sms'
        message.save
        message.send_sms
        if check_ids(message[:sender_id], vals[:user_id])
          message.create_message_task unless check_default_user_empty?
        end
        raise GraphQL::ExecutionError, message.errors.full_messages unless message.persisted?

        record_history(message) if vals[:note_id].present?
        message_notification(message)
        { message: message }
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def record_history(message)
        message.record_note_history(context[:current_user])
      end

      def check_default_user_empty?
        context[:current_user].community[:default_users].empty?
      end

      def check_ids(sender_id, user_id)
        sender_id == user_id
      end

      def message_notification(msg)
        context[:site_community]
          .notifications
          .create(notifable_id: msg[:id], notifable_type: 'Message', user_id: msg[:user_id])
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

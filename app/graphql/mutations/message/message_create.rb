# frozen_string_literal: true

module Mutations
  module Message
    # Create Message
    class MessageCreate < BaseMutation
      argument :receiver, String, required: false
      argument :message, String, required: true
      argument :user_id, ID, required: true

      field :message, Types::MessageType, null: true

      def resolve(vals)
        message = context[:current_user].construct_message(vals)
        message.save
        message.send_sms
        message.create_message_task unless check_default_user_empty?
        return { message: message } if message.persisted?

        raise GraphQL::ExecutionError, message.errors.full_messages
      end

      def check_default_user_empty?
        context[:current_user].community[:default_users].empty?
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

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
        # message.send_sms
        return { message: message } if message.persisted?

        raise GraphQL::ExecutionError, message.errors.full_messages
      end
    end
  end
end

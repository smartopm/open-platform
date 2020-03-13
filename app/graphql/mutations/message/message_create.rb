# frozen_string_literal: true

module Mutations
  module Message
    # Create Message
    class MessageCreate < BaseMutation
      argument :receiver, String, required: true
      argument :sms_content, String, required: true
      argument :receiver_id, String, required: true

      field :messages, Types::MessageType, null: true

      def resolve(vals)
        message = context[:current_user].messages.new(vals)

        message.save
        message.send_sms(vals[:receiver], vals[:sms_content])
        return { message: message } if message.persisted?

        raise GraphQL::ExecutionError, message.errors.full_messages
      end
    end
  end
end

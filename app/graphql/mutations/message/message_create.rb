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
        message = context[:current_user].messages.new(vals)
        message.sender_id = context[:current_user].id
        message.user_id = vals[:user_id]
        message.save

        return unless vals[:receiver]

        message.send_sms(vals[:receiver], vals[:message])
        
        return { message: message } if message.persisted?

        raise GraphQL::ExecutionError, message.errors.full_messages
      end
    end
  end
end

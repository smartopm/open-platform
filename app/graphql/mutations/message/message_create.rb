# frozen_string_literal: true

module Mutations
  module Message
    # Create Message
    class MessageCreate < BaseMutation
      argument :to, String, required: true
      argument :sms_content, String, required: true

      field :messages, Types::MessageType, null: true

      def resolve(vals)
        message = ::Message.new(
        #   user_id: context[:current_user].id,
          receiver: vals[:to],
          sms_content: vals[:sms_content],
        )
       
        message.save
        # message.send_sms(vals[:to], vals[:sms_content])
        return { message: message } if message.persisted?

        raise GraphQL::ExecutionError, message.errors.full_messages
      end
    end
  end
end

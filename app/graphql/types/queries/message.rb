# frozen_string_literal: true

# Queries module for breaking out queries
module Types::Queries::Message
  extend ActiveSupport::Concern

  included do
    # Get messages
    field :messages, [Types::MessageType], null: true do
      description 'Get a list of messages'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get messages for one user
    field :user_messages, [Types::MessageType], null: true do
      description 'Get a list of messages for one user'
      argument :id, GraphQL::Types::ID, required: true
    end
  end

  def messages(offset: 0, limit: 100)
    message = Message.all
                     .limit(limit).offset(offset)
    return message.index_by {|mess| mess[:user_id]}.values
  end

  def user_messages(id:)
    Message.where(user_id: id)
  end
end

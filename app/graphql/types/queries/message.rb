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
    iq =
      Message.all.joins(:user, :sender).select('DISTINCT ON
  (GREATEST(messages.user_id,messages.sender_id), LEAST(messages.user_id,messages.sender_id))
  GREATEST(messages.user_id,messages.sender_id) as lg,
  LEAST(messages.user_id,messages.sender_id) as sm, messages.id')
             .where("users.user_type='admin' OR senders_messages.user_type='admin'")
             .unscope(:order).order('lg ASC,sm ASC,messages.created_at DESC')
             .limit(limit).offset(offset)
    Message.joins(:user, :sender).includes(:user, :sender).unscope(:order)
           .order('messages.created_at DESC').find(iq.collect(&:id))
  end

  def user_messages(id:)
    com_id = context[:current_user].community_id
    Message.joins(:user, :sender).includes(:user, :sender).unscope(:order).
    where('(user_id=? OR sender_id=?)', id, id).
    where('(users.community_id=? AND senders_messages.community_id=?)', com_id, com_id).
    order('messages.created_at DESC').limit(50)
  end
end

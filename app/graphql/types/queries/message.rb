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
    com_id = context[:current_user].community_id
    iq = Message.users_newest_msgs(offset, limit, com_id)
    Message.joins(:user, :sender).eager_load(user: %i[notes avatar_attachment])
           .unscope(:order).order('messages.created_at DESC').find(iq.collect(&:id))
  end

  def user_messages(id:)
    com_id = context[:current_user].community_id
    messages =
      Message.joins(:user, :sender).includes(:user, :sender)
             .unscope(:order).where('(user_id=? OR sender_id=?)', id, id)
             .where('(users.community_id=? AND senders_messages.community_id=?)', com_id, com_id)
             .order('messages.created_at ASC').limit(50)

    messages.collect(&:mark_as_read) unless context[:current_user].admin?
    messages
  end
end

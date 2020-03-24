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
    inner_query = Message.all.joins([:user, :sender]).select('DISTINCT ON(GREATEST(messages.user_id , messages.sender_id),
    LEAST(messages.user_id ,messages.sender_id) ) 
    GREATEST(messages.user_id , messages.sender_id) as larger,
    LEAST(messages.user_id , messages.sender_id) as smaller,
    messages.id').where("users.user_type='admin' or senders_messages.user_type='admin'").unscope(:order).order("larger ASC, 
    smaller ASC, messages.created_at DESC, messages.id DESC").limit(limit).offset(offset)
    message = Message.joins([:user, :sender]).includes([:user, :sender]).order("messages.created_at DESC").find(inner_query.collect(&:id))
  end

  def user_messages(id:)
    Message.where(user_id: id)
  end
end

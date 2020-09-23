# frozen_string_literal: true

# Queries module for breaking out queries
module Types::Queries::Message
  extend ActiveSupport::Concern
  VALID_FILTERS = %w[campaign non_campaign].freeze

  included do
    # Get messages
    field :messages, [Types::MessageType], null: true do
      description 'Get a list of messages'
      argument :query, String, required: false
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :filter, String, required: false
      argument :category, String, required: false
    end

    # Get messages for one user
    field :user_messages, [Types::MessageType], null: true do
      description 'Get a list of messages for one user'
      argument :id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end
  end

  # rubocop:disable Metrics/AbcSize
  def messages(query: '', offset: 0, limit: 100, filter: nil, category: nil)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    raise GraphQL::ExecutionError, 'Invalid Argument Value' if filter.present? &&
                                                               VALID_FILTERS.exclude?(filter)

    com_id = context[:current_user].community_id
    iq = Message.users_newest_msgs(query, offset, limit, com_id, filter, category)
    Message.joins(:user, :sender).eager_load(
      user: { notes: {}, avatar_attachment: {}, accounts: { land_parcel_accounts: :land_parcel } },
    ).unscope(:order).order('messages.created_at DESC').find(iq.collect(&:id))
  end

  def user_messages(id:, offset: 0, limit: 50)
    raise GraphQL::ExecutionError, 'Unauthorized' unless admin_or_self(id)

    com_id = context[:current_user].community_id
    messages =
      Message.joins(:user, :sender).includes(:user, :sender)
             .unscope(:order).where('(user_id=? OR sender_id=?)', id, id)
             .where('(users.community_id=? AND senders_messages.community_id=?)', com_id, com_id)
             .order('messages.created_at ASC').limit(limit).offset(offset)

    messages.collect(&:mark_as_read) unless context[:current_user].admin?
    messages
  end
  # rubocop:enable Metrics/AbcSize
end

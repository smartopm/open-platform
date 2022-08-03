# frozen_string_literal: true

# Queries module for breaking out queries
module Types::Queries::Message
  extend ActiveSupport::Concern
  VALID_FILTERS = %w[/campaign /non_campaign sms/ email/ sms/campaign email/campaign
                     sms/non_campaign email/non_campaign].freeze

  included do
    # Get messages
    field :messages, [Types::MessageType], null: true do
      description 'Get a list of messages'
      argument :query, String, required: false
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :filter, String, required: false
    end

    # Get messages for one user
    field :user_messages, [Types::MessageType], null: true do
      description 'Get a list of messages for one user'
      argument :id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :msg_notification_count, Integer, null: true do
      description 'Get the message notification count for current user'
    end
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def messages(query: '', offset: 0, limit: 100, filter: nil)
    unless permitted?(admin: true, module: :messages,
                      permission: :can_access_messages)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    if filter.present? && VALID_FILTERS.exclude?(filter)
      raise GraphQL::ExecutionError, I18n.t('errors.invalid_argument_value')
    end

    com_id = context[:current_user].community_id
    checked_filters = check_filter(filter.to_s)

    iq = Notifications::Message.users_newest_msgs(query, offset, limit, com_id, checked_filters)
    Notifications::Message.joins(:user, :sender)
                          .unscope(:order)
                          .order('messages.created_at DESC').find(iq.collect(&:id))
  end

  def user_messages(id:, offset: 0, limit: 50)
    unless permitted?(admin: true, module: :messages,
                      permission: :can_access_user_messages) || context[:current_user]&.id.eql?(id)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    messages = Notifications::Message.unscope(:order)
                                     .where('user_id = ? or sender_id = ?', id, id)
                                     .order(created_at: :desc).limit(limit).offset(offset)
    messages.collect(&:mark_as_read) unless context[:current_user].admin?
    messages
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def check_filter(params)
    category, flt = params.split('/')
    {
      cat: category.to_s,
      filter: flt,
    }
  end

  def msg_notification_count
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    context[:current_user].notifications
                          .where(notifable_type: 'Notifications::Message', seen_at: nil).count
  end

  private

  # Fetches user's messages.
  #
  # @param id [String] User#id
  # @param offset [Integer]
  # @param limit [Integer]
  #
  # @return [Array<Notifications::Message>]
  def fetch_messages(id, offset, limit)
    com_id = context[:current_user].community_id
    Notifications::Message.joins(:user, :sender).includes(:user, :sender)
                          .unscope(:order).where('(user_id=? OR sender_id=?)', id, id)
                          .where(
                            '(users.community_id=? AND senders_messages.community_id=?)',
                            com_id, com_id
                          )
                          .order('messages.created_at ASC').limit(limit).offset(offset)
  end
end

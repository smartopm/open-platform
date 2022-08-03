# frozen_string_literal: true

# Transaction log queries
module Types::Queries::TransactionLog
  extend ActiveSupport::Concern

  included do
    field :user_transaction_logs, [Types::TransactionLogType], null: true do
      description 'Get transaction logs for resident and clients'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :transaction_logs, [Types::TransactionLogType], null: true do
      description 'Get all Transaction Logs'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def user_transaction_logs(user_id:, offset: 0, limit: 10)
    validate_authorization(:transaction, :can_view_transaction_logs)
    user = context[:site_community].users.find(user_id)

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless authorized_user(user.id)

    context[:site_community].transaction_logs.where(user_id: user_id).offset(offset).limit(limit)
  end

  def transaction_logs(offset: 0, limit: 10)
    validate_authorization(:transaction, :can_view_all_transaction_logs)

    context[:site_community].transaction_logs.offset(offset).limit(limit)
  end

  def authorized_user(user_id)
    context[:current_user].user_type.eql?('admin') ||
      context[:current_user].id.eql?(user_id)
  end
end

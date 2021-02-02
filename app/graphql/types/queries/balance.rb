# frozen_string_literal: true

# balance queries
module Types::Queries::Balance
  extend ActiveSupport::Concern

  included do
    # Get balance
    field :user_balance, Integer, null: true do
      description 'Get a balance by user id'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  # rubocop:disable Metrics/AbcSize
  def user_balance(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         user_id.eql?(context[:current_user]&.id)

    user = context[:site_community].users.find(user_id)
    raise GraphQL::ExecutionError, 'User not found' if user.blank?

    wallet = user.wallet
    wallet.pending_balance.positive? ? -wallet.pending_balance : wallet.balance
  end
  # rubocop:enable Metrics/AbcSize
end

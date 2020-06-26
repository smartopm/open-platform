# frozen_string_literal: true

# business queries
module Types::Queries::Business
  extend ActiveSupport::Concern

  included do
    # Get business entries
    field :businesses, [Types::BusinessType], null: true do
      description 'Get all business entries'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def businesses(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    # Find out if we can use User.allowed...
    Business.where(community_id: context[:current_user].community_id)
            .order(name: :asc)
            .limit(limit)
            .offset(offset)
  end
end

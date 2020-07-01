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
    
    # Get business entries
    field :business, Types::BusinessType, null: true do
      description 'Get a business by id'
      argument :id, GraphQL::Types::ID, required: true
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

  def business(id:)
    business = context[:current_user].businesses.find_by(id: id)
    business
  end
end

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

    # Get business
    field :business, Types::BusinessType, null: true do
      description 'Get a business by id'
      argument :id, GraphQL::Types::ID, required: true
    end

    # Get business for the user, using the user id
    field :user_business, [Types::BusinessType], null: true do
      description 'Get business by its owner id'
      argument :user_id, GraphQL::Types::ID, required: true
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
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    business = Business.find_by(community_id: context[:current_user].community_id, id: id)
    business
  end

  def user_business(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    u_business = User.find_by(
      community_id: context[:current_user].community_id, id: user_id,
    ).businesses.all
    u_business
  end
end
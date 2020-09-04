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

    field :delete_business, Types::BusinessType, null: true do
      description 'Delete a business by id'
      argument :id, GraphQL::Types::ID, required: true
    end
  end

  def businesses(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    # Find out if we can use User.allowed...
    context[:site_community].businesses
                            .order(name: :asc)
                            .limit(limit)
                            .offset(offset)
  end

  def business(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].businesses.find(id)
  end

  def user_business(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].users.find(user_id)&.businesses&.all
  end

  def delete_business(id:)
    adm = context[:current_user]
    raise GraphQL::ExecutionError, 'Unauthorized' unless adm.present? && adm.admin?

    context[:site_community].businesses.update_all({:status => 'deleted'}, {:id => id})
  end
end

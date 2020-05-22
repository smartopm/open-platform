# frozen_string_literal: true

# Queries module for breaking out queries
module Types::Queries::EntryRequest
  extend ActiveSupport::Concern

  included do
    # Get a entry logs for a user
    field :entry_request, Types::EntryRequestType, null: true do
      description 'Get an entry request'
      argument :id, GraphQL::Types::ID, required: true
    end

    # Get a entry logs for a user
    field :entry_requests, [Types::EntryRequestType], null: true do
      description 'Get a list of entry request'
    end
  end

  def entry_request(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    EntryRequest.find(id)
  end

  def entry_requests
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    EntryRequest.where(community_id: context[:current_user].community_id)
  end
end

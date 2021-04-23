# frozen_string_literal: true

# community queries
module Types::Queries::Community
  extend ActiveSupport::Concern

  included do
    # get community by its id
    field :community, Types::CommunityType, null: true do
      description 'Find a community by ID'
      argument :id, GraphQL::Types::ID, required: true
    end
    # current community
    field :current_community, Types::CommunityType, null: true do
      description 'Get current community'
    end
  end

  def community(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    Community.find(id)
  end

  def current_community
    context[:site_community]
  end
end

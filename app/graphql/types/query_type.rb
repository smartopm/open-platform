# frozen_string_literal: true

module Types
  # QueryType
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # Get a member's information
    field :member, MemberType, null: true do
      description 'Find a member by ID'
      argument :id, ID, required: true
    end

    def member(id:)
      Member.find(id) if context[:current_user]
    end

    field :community, CommunityType, null: true do
      description 'Find a community by ID'
      argument :id, ID, required: true
    end

    def community(id:)
      Community.find(id) if context[:current_user]
    end

    # Get a current user information
    field :current_user, UserType, null: true do
      description 'Get the current logged in user'
    end

    def current_user
      return context[:current_user] if context[:current_user]

      { error: 'Must be logged in to perform this action' }
    end
  end
end

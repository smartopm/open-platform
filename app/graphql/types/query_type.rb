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

    # Get a member's information
    field :member_search, [MemberType], null: true do
      description 'Find a member by name'
      argument :name, String, required: true
    end

    def member_search(name:)
      users = User.where('name ILIKE ?', '%' + name + '%').limit(20)
      users.map(&:members).flatten
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

    # Get a entry logs for a member
    field :entry_logs, [ActivityLogType], null: true do
      description 'Get entry logs for a member'
      argument :member_id, ID, required: true
    end

    def entry_logs(member_id:)
      ActivityLog.where(member_id: member_id) if context[:current_user]
    end
  end
end

# frozen_string_literal: true

module Types
  # QueryType
  class QueryType < Types::BaseObject
    include Types::Queries::EventLog
    include Types::Queries::EntryRequest

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # Get a member's information
    field :user, UserType, null: true do
      description 'Find a user by ID'
      argument :id, ID, required: true
    end

    def user(id:)
      User.find(id) if context[:current_user]
    end

    # Get a member's information
    field :user_search, [UserType], null: true do
      description 'Find a user by name'
      argument :name, String, required: true
    end

    def user_search(name:)
      User.where('name ILIKE ?', '%' + name + '%')
          .where(community_id: context[:current_user].community_id).limit(20)
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

      raise GraphQL::ExecutionError, 'Must be logged in to perform this action'
    end

    # Get a entry logs for a user
    field :pending_users, [UserType], null: true do
      description 'Get all pending members'
    end

    def pending_users
      User.where(state: 'pending',
                 community_id: context[:current_user].community_id)
    end

    # Get a list of guards
    field :security_guards, [UserType], null: true do
      description 'Get a list of security guards for a community'
    end

    def security_guards
      return unless context[:current_user]

      User.where(
        community_id: context[:current_user].community_id,
        user_type: 'security_guard',
      )
    end

    field :all_notes, [NoteType], null: false do
      description 'Returns a list of all the notes'
    end

    def all_notes
      Note.all
    end

    field :flagged_notes, [NoteType], null: false do
      description 'Returns a list of all the flagged notes, basically todos'
    end

    def flagged_notes
      Note.where(flagged: true)
    end

    field :entry_search, [EntryRequestType], null: true do
      description 'Find an entry by user'
      argument :name, String, required: true
    end

    def entry_search(name:)
      EntryRequest.where('name ILIKE ?', '%' + name + '%').limit(20)
    end

  end
end

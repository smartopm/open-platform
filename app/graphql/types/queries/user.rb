# frozen_string_literal: true

# Queries module for breaking out queries
module Types::Queries::User
  extend ActiveSupport::Concern
  included do
    # Get a member's information
    field :user, Types::UserType, null: true do
      description 'Find a user by ID'
      argument :id, GraphQL::Types::ID, required: true
    end

    # Get a list of all users information
    field :users, [Types::UserType], null: true do
      description 'Get a list of all the users'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    # Get a member's information
    field :user_search, [Types::UserType], null: true do
      description 'Find a user by name, phone number or user type'
      argument :query, String, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get a entry logs for a user
    field :pending_users, [Types::UserType], null: true do
      description 'Get all pending members'
    end

    # Get a current user information
    field :current_user, Types::UserType, null: true do
      description 'Get the current logged in user'
    end

    # Get a list of guards
    field :security_guards, [Types::UserType], null: true do
      description 'Get a list of security guards for a community'
    end
  end

  def user(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    User.allowed_users(context[:current_user]).find(id)
  end

  def users(offset: 0, limit: 100, query: nil)
    adm = context[:current_user]
    puts "CDDFDFDFDFDFDFD: #{context[:site_community].inspect}" if context[:site_community].present?
    raise GraphQL::ExecutionError, 'Unauthorized' unless adm.present? && adm.admin?

    User.allowed_users(context[:current_user]).eager_load(:notes, :accounts)
        .search(query)
        .limit(limit)
        .offset(offset).with_attached_avatar
  end

  def user_search(query: nil, offset: 0, limit: 50)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]

    User.allowed_users(context[:current_user]).eager_load(:notes, :accounts)
        .search(query)
        .order(name: :asc)
        .limit(limit)
        .offset(offset).with_attached_avatar
  end

  def current_user
    return context[:current_user] if context[:current_user]

    raise GraphQL::ExecutionError, 'Must be logged in to perform this action'
  end

  def pending_users
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]

    User.allowed_users(context[:current_user]).eager_load(:notes, :accounts)
        .where(state: 'pending',
               community_id: context[:current_user].community_id).with_attached_avatar
  end

  def security_guards
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]

    User.allowed_users(context[:current_user]).eager_load(:notes, :accounts).where(
      community_id: context[:current_user].community_id,
      user_type: 'security_guard',
    ).order(name: :asc).with_attached_avatar
  end
end

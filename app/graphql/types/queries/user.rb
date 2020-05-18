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
    end

    # Get a member's information
    field :user_search, [Types::UserType], null: true do
      description 'Find a user by name, phone number or user type'
      argument :query, String, required: true
    end

    # Get a entry logs for a user
    field :pending_users, [Types::UserType], null: true do
      description 'Get all pending members'
    end

    # Get a current user information
    field :current_user, Types::UserType, null: true do
      description 'Get the current logged in user'
    end
  end

  def user(id:)
    User.find(id) if context[:current_user]
  end

  def users(offset: 0, limit: 100)
    User.all.order(created_at: :desc)
        .limit(limit).offset(offset)
  end

  def user_search(query:)
    User.where('name ILIKE :query OR phone_number ILIKE :query OR user_type ILIKE :query',
               query: "%#{query}%")
        .where(community_id: context[:current_user].community_id).limit(20)
  end

  def current_user
    return context[:current_user] if context[:current_user]

    raise GraphQL::ExecutionError, 'Must be logged in to perform this action'
  end

  def pending_users
    User.where(state: 'pending',
               community_id: context[:current_user].community_id)
  end
end

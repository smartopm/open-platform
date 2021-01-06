# frozen_string_literal: true

# Queries module for breaking out queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::User
  extend ActiveSupport::Concern
  # rubocop:disable Metrics/BlockLength
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

    # Get a list of admins assignable to tasks
    field :users_lite, [Types::UserType], null: true do
      description 'Get a list of admins for a community'
      argument :query, String, required: true
    end

    # Get activity-point of a user for the current week
    field :user_activity_point, Types::UserPointType, null: true do
      description 'Get activity-point of a user for the current week'
    end

    # Get users count
    field :users_count, Integer, null: false do
      description 'Get users count based on a query param'
      argument :query, String, required: false
    end
  end
  # rubocop:enable Metrics/BlockLength

  def user(id:)
    authorized = context[:current_user].present? &&
                 User.allowed_users(context[:current_user]).pluck(:id).include?(id)
    raise GraphQL::ExecutionError, 'Unauthorized' unless authorized

    find_community_user(id)
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def users(offset: 0, limit: 50, query: nil)
    adm = context[:current_user]
    raise GraphQL::ExecutionError, 'Unauthorized' unless adm.present? && adm.admin?

    if query.present? && query.include?('date_filter')
      User.allowed_users(context[:current_user]).includes(accounts: [:land_parcels])
          .eager_load(:notes, :accounts, :labels, :contact_infos)
          .heavy_search(query)
          .order(name: :asc)
          .limit(limit)
          .offset(offset).with_attached_avatar
    else
      User.allowed_users(context[:current_user]).includes(accounts: [:land_parcels])
          .eager_load(:notes, :accounts, :labels, :contact_infos)
          .search(query)
          .order(name: :asc)
          .limit(limit)
          .offset(offset).with_attached_avatar
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def user_search(query: '', offset: 0, limit: 50)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]

    search_method = 'search'

    if query.include?('date_filter')
      search_method = 'heavy_search'
    elsif query.include?('plot_no')
      search_method = 'plot_number'
      query = query.split(' ').last
    elsif query.include?('contact_info')
      search_method = 'search_by_contact_info'
      query = query.split(' ').last
    end

    User.allowed_users(context[:current_user]).includes(accounts: [:land_parcels])
        .eager_load(:notes, :accounts, :labels, :contact_infos)
        .send(search_method, query)
        .order(name: :asc)
        .limit(limit)
        .offset(offset).with_attached_avatar
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def current_user
    return context[:current_user] if context[:current_user]

    raise GraphQL::ExecutionError, 'Must be logged in to perform this action'
  end

  def pending_users
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]

    User.allowed_users(context[:current_user]).includes(accounts: [:land_parcels])
        .eager_load(:notes, :accounts, :labels, :contact_infos)
        .where(state: 'pending',
               community_id: context[:current_user].community_id).with_attached_avatar
  end

  def security_guards
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]

    User.allowed_users(context[:current_user]).includes(accounts: [:land_parcels])
        .eager_load(:notes, :accounts, :labels, :contact_infos)
        .where(
          community_id: context[:current_user].community_id,
          user_type: 'security_guard',
        ).order(name: :asc).with_attached_avatar
  end

  def users_lite(offset: 0, limit: 100, query: nil)
    adm = context[:current_user]
    raise GraphQL::ExecutionError, 'Unauthorized' unless adm.present? && adm.admin?

    User.allowed_users(context[:current_user])
        .search_lite(query)
        .order(name: :asc)
        .limit(limit)
        .offset(offset).with_attached_avatar
  end

  def find_community_user(id)
    user = User.allowed_users(context[:current_user]).find(id)
    return user if user.present?

    raise GraphQL::ExecutionError, 'User not found'
  end

  def user_activity_point
    user = context[:current_user]
    raise GraphQL::ExecutionError, 'Unauthorized' unless user

    activity_point = user.activity_point_for_current_week
    activity_point || ActivityPoint.create!(user: user)
  end

  def users_count(query: nil)
    adm = context[:current_user]
    raise GraphQL::ExecutionError, 'Unauthorized' unless adm.present? && adm.admin?

    allowed_users = User.allowed_users(context[:current_user])
    if query.present? && query.include?('date_filter')
      allowed_users.heavy_search(query).size
    else
      allowed_users.search(query).size
    end
  end
end
# rubocop:enable Metrics/ModuleLength

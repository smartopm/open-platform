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
      argument :query, String, required: false
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
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
      argument :limit, Integer, required: false
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

    # get users per status
    field :substatus_query, Types::SubstatusType, null: false do
      description 'Get report of users per substatus'
    end

    field :substatus_distribution_query, Types::SubstatusDistributionReportType, null: true do
      description 'Get substatus distribution report'
    end

    field :user_active_plan, GraphQL::Types::Boolean, null: true do
      description 'returns true if a user has an active payment plan'
    end

    # Get a list of all admin users
    field :admin_users, [Types::UserType], null: true do
      description 'Get a list of all admin users'
    end

    field :search_guests, [Types::UserType], null: true do
      argument :query, String, required: false
      description 'Get a list of visitors to be invited'
    end

    field :my_guests, [Types::InviteType], null: true do
      argument :query, String, required: false
      description 'Get a list of visitors that I invited'
    end
  end
  # rubocop:enable Metrics/BlockLength

  def user(id:)
    authorized = context[:current_user].present? &&
                 Users::User.allowed_users(context[:current_user]).pluck(:id).include?(id)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless authorized

    find_community_user(id)
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def users(offset: 0, limit: 50, query: nil)
    unless ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      admin: true,
      module: :user,
      permission: :can_get_users,
    )
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    if query.present? && query.include?('date_filter')
      Users::User.allowed_users(context[:current_user])
                 .eager_load(:labels)
                 .heavy_search(query)
                 .order(name: :asc)
                 .limit(limit)
                 .offset(offset).with_attached_avatar
    else
      Users::User.allowed_users(context[:current_user])
                 .eager_load(:labels)
                 .search(query)
                 .order(name: :asc)
                 .limit(limit)
                 .offset(offset).with_attached_avatar
    end
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  def user_search(query: '', offset: 0, limit: 50)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless context[:current_user]

    search_method = 'search'

    if query&.include?('date_filter')
      search_method = 'heavy_search'
    elsif query&.include?('plot_no')
      search_method = 'plot_number'
      query = query.split(' ').last
    elsif query&.include?('contact_info')
      search_method = 'search_by_contact_info'
      query = query.split(' ').last
    end
    Users::User.allowed_users(context[:current_user])
               .send(search_method, query)
               .order(name: :asc)
               .limit(limit)
               .offset(offset).with_attached_avatar
  end
  # rubocop:enable Metrics/MethodLength

  def current_user
    return context[:current_user] if context[:current_user]

    raise GraphQL::ExecutionError, 'Must be logged in to perform this action'
  end

  def security_guards
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless context[:current_user]

    Users::User.allowed_users(context[:current_user])
               .where(
                 community_id: context[:current_user].community_id,
                 user_type: 'security_guard',
               ).order(name: :asc)
  end

  # rubocop:disable Metrics/MethodLength
  def users_lite(offset: 0, limit: 50, query: nil)
    current = context[:current_user]
    unless ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      module: :user,
      permission: :can_get_users_lite,
    ) || current.site_manager? || current.site_worker?
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    Users::User.allowed_users(context[:current_user])
               .includes(:accounts)
               .search_lite(query)
               .order(name: :asc)
               .limit(limit)
               .offset(offset).with_attached_avatar
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def find_community_user(id)
    user = Users::User.allowed_users(context[:current_user]).find(id)
    return user if user.present?

    raise GraphQL::ExecutionError,
          I18n.t('errors.user.not_found')
  end

  def user_activity_point
    user = context[:current_user]
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless user

    activity_point = user.activity_point_for_current_week
    activity_point || Users::ActivityPoint.create!(user: user)
  end

  def users_count(query: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless user_permissions_check?

    allowed_users = Users::User.allowed_users(context[:current_user])
    if query.present? && query.include?('date_filter')
      allowed_users.heavy_search(query).size
    else
      allowed_users.search(query).size
    end
  end

  # rubocop:disable Metrics/MethodLength
  def substatus_query
    unless ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      admin: true,
      module: :user,
      permission: :can_get_substatus_count,
    )
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    users = context[:site_community].users
    residents_count = users.where(user_type: :resident).count
    users.group(:sub_status).count.merge(residents_count: residents_count)
  end
  # rubocop:enable Metrics/MethodLength

  def substatus_distribution_query
    unless ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      admin: true,
      module: :user,
      permission: :can_get_substatus_distribution,
    )
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    Logs::SubstatusLog.create_time_distribution_report(context[:site_community].id)
  end

  def user_active_plan
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless context[:current_user]

    context[:current_user].active_payment_plan?
  end

  def admin_users
    unless ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      admin: true,
      module: :user,
      permission: :can_view_admin_users,
    )
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].users.where(user_type: 'admin', state: 'valid')
  end

  # rubocop:disable Metrics/AbcSize:
  # rubocop:disable Metrics/MethodLength
  def search_guests(query: nil)
    current = context[:current_user]
    unless ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      module: :user,
      permission: :can_search_guests,
    ) || current.site_manager? || current.site_worker?
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize

    Users::User.allowed_users(context[:current_user])
               .where(user_type: 'visitor')
               .search_guest(query)
               .order(name: :asc)
               .limit(1).with_attached_avatar
  end

  def my_guests(query: nil)
    unless ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      admin: true,
      module: :user,
      permission: :can_view_guests,
    )
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:current_user].invitees
                          .includes(:guest, :host, :entry_time)
                          .search(query)
  end

  def user_permissions_check?
    ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      admin: true,
      module: :user,
      permission: :can_get_user_count,
    )
  end
end
# rubocop:enable Metrics/ModuleLength

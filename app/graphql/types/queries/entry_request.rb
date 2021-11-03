# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
# Queries module for breaking out queries
module Types::Queries::EntryRequest
  extend ActiveSupport::Concern
  # rubocop:disable Metrics/BlockLength
  included do
    # Get a entry logs for a user
    field :entry_request, Types::EntryRequestType, null: true do
      description 'Get an entry request'
      argument :id, GraphQL::Types::ID, required: true
    end

    field :guest_list_entry, Types::EntryRequestType, null: true do
      description 'Get an entry request for guest list'
      argument :id, GraphQL::Types::ID, required: true
    end

    # Get a entry logs for a user
    field :entry_requests, [Types::EntryRequestType], null: true do
      description 'Get a list of entry request'
    end

    # Get a entry logs for a user
    field :scheduled_requests, [Types::EntryRequestType], null: true do
      description 'Get a list of scheduled entry requests'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
      argument :scope, Integer, required: false
    end

    field :scheduled_guest_list, [Types::EntryRequestType], null: true do
      description 'Get a list of scheduled entry requests'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end
  end
  # rubocop:enable Metrics/BlockLength

  def entry_request(id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless can_view_entry_request

    context[:site_community].entry_requests.find(id)
  end

  def guest_list_entry(id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless context[:current_user]

    context[:site_community].entry_requests
                            .where(
                              user: context[:current_user], is_guest: true,
                            ).find(id)
  end

  def entry_requests
    unless admin_or_security_guard || entry_request_permissions_check
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].entry_requests
                            .where(community_id: context[:current_user].community_id)
                            .with_attached_images
                            .with_attached_video
  end

  # check if we need to allow residents to see all scheduled requests
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def scheduled_requests(offset: 0, limit: 50, query: nil, scope: nil)
    unless admin_or_security_guard || entry_request_permissions_check?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    entry_requests = context[:site_community].entry_requests.where.not(visitation_date: nil)
                                             .includes(:user)
                                             .limit(limit)
                                             .offset(offset)
                                             .unscope(:order)
                                             .order(created_at: :desc)
                                             .with_attached_images
                                             .with_attached_video
    entry_requests = handle_search(entry_requests, query) if query
    entry_requests = entry_requests.by_end_time(scope.to_i.days.ago) if scope
    entry_requests
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize
  def scheduled_guest_list(offset: 0, limit: 50, query: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless context[:current_user]

    context[:site_community]
      .entry_requests
      .where(user: context[:current_user], is_guest: true)
      .where.not(visitation_date: nil)
      .includes(:user).search(query)
      .limit(limit).offset(offset)
      .unscope(:order).order(created_at: :desc)
      .with_attached_images
      .with_attached_video
  end
  # rubocop:enable Metrics/AbcSize

  private

  # rubocop:disable Metrics/MethodLength,  Metrics/AbcSize
  def handle_search(entry_requests, query)
    # Support legacy ends_at field for search
    # Also search by visit_end_date to find re-ocurring visits
    if query.match(/ends_at/) && !query.match(/>=/)
      # rubocop:disable Style/CaseLikeIf
      if query.match(/!=/)
        end_time = query.split('!=')[1].strip
        query += " or end_time != #{end_time} or visit_end_date != #{end_time}"
      elsif query.match(/>/)
        end_time = query.split('>')[1].strip
        query += " or end_time > #{end_time} or visit_end_date > #{end_time}"
      elsif query.match(/</)
        end_time = query.split('<')[1].strip
        query += " or end_time < #{end_time} or visit_end_date < #{end_time}"
      else
        end_time = query.split('ends_at :')[1].strip
        query += " or end_time: #{end_time} or visit_end_date: #{end_time}"
      end
      # rubocop:enable Style/CaseLikeIf
    end
    entry_requests.search(query)
  end
  # rubocop:enable Metrics/MethodLength,  Metrics/AbcSize

  def admin_or_security_guard
    context[:current_user]&.admin? || context[:current_user]&.security_guard?
  end

  def can_view_entry_request
    current_user = context[:current_user]
    ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      module: :entry_request,
      permission: :can_view_entry_request,
    ) || current_user&.admin? || current_user&.client? || current_user&.resident? ||
      current_user&.custodian? || current_user&.security_guard?
  end

  def entry_request_permissions_check?
    ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      module: :entry_request,
      permission: :can_view_entry_requests,
    )
  end
  # rubocop:enable Metrics/ModuleLength
end

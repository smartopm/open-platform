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

    # Get a entry logs for a user
    field :scheduled_requests, [Types::EntryRequestType], null: true do
      description 'Get a list of scheduled entry requests'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
      argument :scope, Integer, required: false
    end
  end

  def entry_request(id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless admin_or_security_guard

    context[:site_community].entry_requests.find(id)
  end

  def entry_requests
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless admin_or_security_guard

    context[:site_community].entry_requests.where(community_id: context[:current_user].community_id)
  end

  # check if we need to allow residents to see all scheduled requests
  # rubocop:disable Metrics/AbcSize
  def scheduled_requests(offset: 0, limit: 50, query: nil, scope: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless admin_or_security_guard

    entry_requests = context[:site_community].entry_requests.where.not(visitation_date: nil)
                                             .includes(:user)
                                             .limit(limit)
                                             .offset(offset)
                                             .unscope(:order)
                                             .order(created_at: :desc)
    entry_requests = handle_search(entry_requests, query) if query
    entry_requests = entry_requests.by_end_time(scope.to_i.days.ago) if scope
    entry_requests
  end
  # rubocop:enable Metrics/AbcSize

  private

  def handle_search(entry_requests, query)
    # Support legacy ends_at field for search
    # Also search by visit_end_date to find re-ocurring visits
    if query.match(/ends_at/)
      end_time = query.split('ends_at :')[1].strip
      query += " or end_time: #{end_time} or visit_end_date: #{end_time}"
    end
    entry_requests.search(query)
  end

  def admin_or_security_guard
    context[:current_user].admin? || context[:current_user].security_guard?
  end
end

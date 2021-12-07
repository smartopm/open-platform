# frozen_string_literal: true

# Queries module for breaking out queries
# rubocop:disable Metrics/ModuleLength
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
    end

    field :scheduled_guest_list, [Types::EntryRequestType], null: true do
      description 'Get a list of scheduled entry requests'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    field :current_guests, [Types::EntryRequestType], null: true do
      description 'Get a list of guests who\'ve been granted access'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end
  end
  # rubocop:enable Metrics/BlockLength

  def entry_request(id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless can_view_entry_request?

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
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless can_view_entry_requests?

    context[:site_community].entry_requests
                            .where(community_id: context[:current_user].community_id)
                            .with_attached_images
                            .with_attached_video
  end

  # check if we need to allow residents to see all scheduled requests
  # rubocop:disable Metrics/MethodLength, Layout/LineLength
  def scheduled_requests(offset: 0, limit: 50, query: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless can_view_entry_requests?

    entry_requests = context[:site_community].entry_requests
                                             .where('guest_id IS NOT NULL AND visitation_date IS NOT NULL')
                                             .includes(:user, :guest, :entry_times, :invites)
                                             .limit(limit)
                                             .offset(offset)
                                             .unscope(:order)
                                             .order(created_at: :desc)
                                             .with_attached_images
                                             .with_attached_video
    entry_requests = handle_search(entry_requests, query) if query
    entry_requests
  end
  # rubocop:enable Layout/LineLength

  # rubocop:disable Metrics/AbcSize
  def scheduled_guest_list(offset: 0, limit: 50, query: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless context[:current_user]

    context[:site_community]
      .entry_requests
      .where(user: context[:current_user], is_guest: true)
      .where.not(visitation_date: nil)
      .includes(:user)
      .search(or: [{ query: (query.presence&.strip || '.') },
                   { name: { matches: query&.strip } }])
      .limit(limit).offset(offset)
      .unscope(:order).order(created_at: :desc)
      .with_attached_images
      .with_attached_video
  end

  def current_guests(offset: 0, limit: 50, query: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless can_view_entry_requests?

    context[:site_community]
      .entry_requests
      .where.not(granted_at: nil)
      .includes(:user, :guest, :entry_times, :invites)
      .search(or: [{ query: (query.presence || '.') }, { name: { matches: query } }])
      .limit(limit).offset(offset)
      .unscope(:order).order(granted_at: :desc)
  end
  # rubocop:enable Metrics/AbcSize

  private

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
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
      # rubocop:enable Metrics/CyclomaticComplexity
      # rubocop:enable Metrics/PerceivedComplexity
    end
    entry_requests.search(or: [{ query: (query.presence&.strip || '.') },
                               { name: { matches: query&.strip } }])
  end
  # rubocop:enable Metrics/MethodLength,  Metrics/AbcSize

  def can_view_entry_request?
    permitted?(module: :entry_request, permission: :can_view_entry_request)
  end

  def can_view_entry_requests?
    permitted?(module: :entry_request, permission: :can_view_entry_requests)
  end
end
# rubocop:enable Metrics/ModuleLength:

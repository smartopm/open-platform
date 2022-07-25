# frozen_string_literal: true

# Queries module for breaking out queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::EntryRequest
  include Types::Queries::Helpers::EntryRequest
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
      argument :type, String, required: false
      argument :duration, String, required: false
    end

    field :community_people_statistics, Types::PeopleStatisticType, null: true do
      argument :duration, String, required: false
      description 'Get statistics about people who are in the community'
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
  # rubocop:disable Metrics/MethodLength
  def scheduled_requests(offset: 0, limit: 50, query: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless can_view_entry_requests?

    entry_requests = context[:site_community].entry_requests
                                             .includes(:user, :guest)
                                             .where('entry_requests.guest_id IS NOT NULL
                                                  AND entry_requests.visitation_date IS NOT NULL')
                                             .limit(limit)
                                             .offset(offset)
                                             .order_by_recent_invites
                                             .with_attached_images
                                             .with_attached_video
    entry_requests = handle_search(entry_requests, query) if query
    entry_requests
  end

  # This is deprecated
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

  def current_guests(offset: 0, limit: 50, query: nil, type: 'allVisits', duration: nil)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless can_view_entry_requests?

    entry_requests = context[:site_community]
                     .entry_requests
                     .where.not(granted_at: nil)
                     .includes(:user, :guest)
                     .limit(limit).offset(offset)
                     .order(granted_at: :desc)

    entry_requests = filter_current_guests(entry_requests, type, duration)
    search_current_guests(entry_requests, query)
  end

  def community_people_statistics(duration: 'today')
    entry_requests = context[:site_community].entry_requests
    {
      people_present: people_present(entry_requests, duration).size,
      people_entered: people_entered(entry_requests, duration).size,
      people_exited: people_exited(entry_requests, duration).size,
    }
  end

  private

  # This is deprecated
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

  def filter_current_guests(entry_requests, type, duration)
    duration = 'today' if duration.blank? && valid_type?(type)
    case type
    when 'peopleEntered'
      people_entered(entry_requests, duration)
    when 'peopleExited'
      people_exited(entry_requests, duration)
    when 'peoplePresent'
      people_present(entry_requests, duration)
    else
      all_people(entry_requests, duration)
    end
  end

  def search_current_guests(entry_requests, query)
    return entry_requests if query.blank?

    entry_requests.search(or: [{ query: (query.presence || '.') }, { name: { matches: query } }])
  end

  def people_present(entry_requests, duration)
    people_entered(entry_requests, duration).where(exited_at: nil)
  end

  def people_entered(entry_requests, duration)
    start_time = duration_based_start_time(duration)
    entry_requests
      .where('granted_at >= ? AND granted_at <= ?', start_time, end_time)
  end

  def people_exited(entry_requests, duration)
    start_time = duration_based_start_time(duration)
    entry_requests
      .where('exited_at IS NOT NULL AND exited_at >= ? AND exited_at <= ?', start_time, end_time)
  end

  def all_people(entry_requests, duration)
    return entry_requests if duration.blank?

    start_time = duration_based_start_time(duration)
    entry_requests
      .where('granted_at >= ? AND granted_at <= ?', start_time, end_time)
  end
  # rubocop:enable Metrics/MethodLength,  Metrics/AbcSize
end
# rubocop:enable Metrics/ModuleLength:

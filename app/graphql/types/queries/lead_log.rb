# frozen_string_literal: true

# leadlog queries
module Types::Queries::LeadLog
  extend ActiveSupport::Concern

  VALID_LEAD_STATUSES = ['Qualified Lead', 'Signed MOU', 'Signed Lease'].freeze

  included do
    field :lead_events, [Types::LeadLogType], null: true do
      description 'Get lead specific events'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :lead_meetings, [Types::LeadLogType], null: true do
      description 'Get lead specific meetings'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :signed_deals, [Types::LeadLogType], null: true do
      description 'Get signed deal for lead'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :lead_scorecards, GraphQL::Types::JSON, null: true do
      description 'Get statistics for lead logs'
    end
  end

  def lead_events(user_id:, offset: 0, limit: 3)
    raise_unauthorized_error_for_lead_logs(:can_fetch_lead_logs)

    context[:site_community].lead_logs.where(user_id: user_id)
                            .event.includes(:acting_user)
                            .offset(offset).limit(limit).ordered
  end

  def lead_meetings(user_id:, offset: 0, limit: 3)
    raise_unauthorized_error_for_lead_logs(:can_fetch_lead_logs)

    context[:site_community].lead_logs.where(user_id: user_id)
                            .meeting.includes(:acting_user)
                            .offset(offset).limit(limit).ordered
  end

  def signed_deals(user_id:, offset: 0, limit: 3)
    raise_unauthorized_error_for_lead_logs(:can_fetch_lead_logs)

    context[:site_community].lead_logs.where(user_id: user_id)
                            .signed_deal.includes(:acting_user)
                            .offset(offset).limit(limit).ordered
  end

  def lead_scorecards
    raise_unauthorized_error_for_lead_logs(:can_access_lead_scorecard)

    {
      lead_status: leads_status_stats,
      leads_monthly_stats_by_division: leads_monthly_stats_by_division,
      leads_monthly_stats_by_status: leads_monthly_stats_by_status,
    }
  end

  def leads_status_stats
    context[:site_community].users.where(user_type: 'lead').group('lead_status').count
  end

  def leads_monthly_stats_by_division
    result = context[:site_community].users
                                     .where(user_type: 'lead', created_at: current_year)
                                     .group('division', '(EXTRACT(MONTH FROM created_at)::integer)')
                                     .count

    result.each_with_object({}) do |((division, month), users_count), data|
      next if division.nil?

      data[division] ||= {}
      data[division][month] = users_count
    end
  end

  # rubocop:disable Metrics/MethodLength
  def leads_monthly_stats_by_status
    result = context[:site_community].lead_logs.lead_status
                                     .joins(:user)
                                     .where(user: { user_type: 'lead' })
                                     .where(name: VALID_LEAD_STATUSES, updated_at: current_year)
                                     .group('name')
                                     .group('(EXTRACT(MONTH FROM lead_logs.updated_at)::integer)')
                                     .count

    result.each_with_object({}) do |((lead_status, month), users_count), data|
      data[lead_status] ||= {}
      data[lead_status][month] = users_count
    end
  end
  # rubocop:enable Metrics/MethodLength

  def current_year
    Time.zone.now.beginning_of_year..Time.zone.now.end_of_year
  end

  def raise_unauthorized_error_for_lead_logs(permission)
    return if permitted?(module: :lead_log, permission: permission)

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end
end

# frozen_string_literal: true

# leadlog queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::LeadLog
  extend ActiveSupport::Concern

  VALID_LEAD_STATUSES = ['Qualified Lead', 'Signed MOU', 'Signed Lease'].freeze

  # rubocop:disable Metrics/BlockLength
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

    field :deal_details, [Types::LeadLogType], null: true do
      description 'Get lead deal details'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :lead_investments, [Types::LeadLogType], null: true do
      description 'Get lead investments'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :investment_stats, GraphQL::Types::JSON, null: true do
      description 'Get lead investment stats'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end
  # rubocop:enable Metrics/BlockLength

  def lead_events(user_id:, offset: 0, limit: 3)
    validate_authorization(:lead_log, :can_fetch_lead_logs)

    context[:site_community].lead_logs.where(user_id: user_id)
                            .event.includes(:acting_user)
                            .offset(offset).limit(limit).ordered
  end

  def lead_meetings(user_id:, offset: 0, limit: 3)
    validate_authorization(:lead_log, :can_fetch_lead_logs)

    context[:site_community].lead_logs.where(user_id: user_id)
                            .meeting.includes(:acting_user)
                            .offset(offset).limit(limit).ordered
  end

  def signed_deals(user_id:, offset: 0, limit: 3)
    validate_authorization(:lead_log, :can_fetch_lead_logs)

    context[:site_community].lead_logs.where(user_id: user_id)
                            .signed_deal.includes(:acting_user)
                            .offset(offset).limit(limit).ordered
  end

  def lead_scorecards
    validate_authorization(:lead_log, :can_access_lead_scorecard)

    {
      lead_status: leads_status_stats,
      leads_monthly_stats_by_division: leads_monthly_stats_by_division,
      leads_monthly_stats_by_status: leads_monthly_stats_by_status,
      ytd_count: ytd_count,
    }
  end

  def leads_status_stats
    context[:site_community].users.where(user_type: 'lead')
                            .where.not(lead_status: ['', nil])
                            .group('lead_status').count
  end

  def leads_monthly_stats_by_division
    lead_stats = context[:site_community].users
                                         .where(user_type: 'lead', created_at: current_year)
                                         .group('division',
                                                '(EXTRACT(MONTH FROM created_at)::integer)')
                                         .count

    monthly_stats(lead_stats, valid_lead_divisions)
  end

  # rubocop:disable Metrics/MethodLength
  def leads_monthly_stats_by_status
    lead_stats = context[:site_community].lead_logs
                                         .lead_status
                                         .joins(:user)
                                         .where(user: { user_type: 'lead' },
                                                name: VALID_LEAD_STATUSES,
                                                updated_at: current_year)
                                         .group(
                                           'name',
                                           '(EXTRACT(MONTH FROM lead_logs.updated_at)::integer)',
                                         ).count

    monthly_stats(lead_stats, VALID_LEAD_STATUSES)
  end
  # rubocop:enable Metrics/MethodLength

  # Returns monthly stats.
  #
  # @param lead_stats [Hash]
  # Ex: ['India', 1] => 3
  # @param valid_values [Array]
  #
  # @return [JSON]
  # Ex: { 'India': { "1": 1, "2": 2, ... ,"12": 0 } }

  def monthly_stats(lead_stats, valid_values)
    stats = format_lead_stats(lead_stats)

    valid_values.each do |value|
      stats[value] = {} if stats[value].nil?
      (1..12).each do |month|
        stats[value][month] = 0 if stats[value][month].nil?
      end
    end
    stats
  end

  def format_lead_stats(lead_stats)
    lead_stats.each_with_object({}) do |((key, month), users_count), data|
      next if key.nil?

      data[key] ||= {}
      data[key][month] = users_count
    end
  end

  def ytd_count
    {
      leads_by_division: leads_by_division_ytd_count,
      qualified_lead: leads_status_ytd_count('Qualified Lead'),
      signed_mou: leads_status_ytd_count('Signed MOU'),
      signed_lease: leads_status_ytd_count('Signed Lease'),
    }
  end

  def leads_by_division_ytd_count
    context[:site_community].users
                            .where(user_type: 'lead',
                                   created_at: current_year,
                                   division: valid_lead_divisions).count
  end

  def leads_status_ytd_count(lead_status)
    context[:site_community].lead_logs.lead_status
                            .joins(:user)
                            .where(user: { user_type: 'lead' },
                                   name: lead_status,
                                   updated_at: current_year).count
  end

  def current_year
    Time.zone.now.beginning_of_year..Time.zone.now.end_of_year
  end

  def lead_investments(user_id:, offset: 0, limit: 3)
    validate_authorization(:lead_log, :can_fetch_lead_logs)

    context[:site_community].lead_logs.where(user_id: user_id)
                            .investment
                            .offset(offset)
                            .limit(limit)
                            .ordered
  end

  def investment_stats(user_id:)
    lead_log = deal_details(user_id: user_id, limit: 1).first
    return {} if lead_log.nil?

    total_spent = context[:site_community].lead_logs.investment.where(user_id: user_id).sum(:amount)

    {
      total_spent: total_spent,
      percentage_of_target_used: percentage_of_target_used(total_spent, lead_log),
    }
  end

  def deal_details(user_id:, offset: 0, limit: 3)
    validate_authorization(:lead_log, :can_fetch_lead_logs)

    context[:site_community].lead_logs.where(user_id: user_id)
                            .deal_details
                            .offset(offset)
                            .limit(limit)
                            .ordered
  end

  def percentage_of_target_used(total_spent, lead_log)
    return 100 if lead_log.deal_size.to_d.zero?

    total_spent / lead_log.deal_size
  end

  def valid_lead_divisions
    context[:site_community].lead_monthly_targets&.map { |data| data['division'] }
  end
end
# rubocop:enable Metrics/ModuleLength

# frozen_string_literal: true

# Queries module for breaking out queries
module Types::Queries::EventLog
  extend ActiveSupport::Concern

  included do
    field :all_event_logs, [Types::EventLogType], null: true do
      description 'Get event logs for the community'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :subject, [String, { null: true }], required: false
      argument :ref_id, GraphQL::Types::ID, required: false
      argument :ref_type, String, required: false
      argument :name, String, required: false
    end

    field :all_event_logs_for_user, [Types::EventLogType], null: true do
      description 'Get event logs for actions a user performed'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :subject, [String, { null: true }], required: false
      argument :user_id, GraphQL::Types::ID, required: true
    end

    field :logbook_event_logs, [Types::EventLogType], null: true do
      description 'Get event logs for logbook'
      argument :start_date, String, required: true
      argument :end_date, String, required: true
    end
  end
  # rubocop:disable Metrics/ParameterLists

  def all_event_logs(subject:, ref_id:, ref_type:, offset: 0, limit: 100, name: nil)
    authorized = context[:current_user]&.role?(%i[security_guard admin security_supervisor])
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless authorized

    query_all_logs(name, subject, ref_id, ref_type, limit, offset)
  end

  def query_all_logs(name, subject, ref_id, ref_type, limit, offset)
    query = build_event_log_query(context[:current_user], subject, ref_id, ref_type)
    return query_logs_with_name(query, name, limit, offset) if name.present?

    context[:site_community].event_logs.includes(:acting_user, :ref)
                            .where(query)
                            .limit(limit).offset(offset)
                            .with_attached_images
  end
  # rubocop:enable Metrics/ParameterLists

  def all_event_logs_for_user(subject:, user_id:, offset: 0, limit: 100)
    current_user = context[:current_user]
    authorized = current_user&.role?(%i[security_guard admin custodian])
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless authorized

    user = context[:site_community].users.find(user_id)
    if current_user.community_id != user.community_id
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    query_user_logs(user, subject, limit, offset)
  end

  def logbook_event_logs(start_date:, end_date:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless can_fetch_logbook_logs?

    window = start_date.to_datetime.beginning_of_day..end_date.to_datetime.end_of_day
    context[:site_community].event_logs.includes(:ref)
                            .where(
                              subject: %w[user_entry visitor_entry observation_log],
                              created_at: window,
                            )
  end

  def build_event_log_query(user, subject, ref_id, ref_type)
    query = { community_id: user.community_id }
    query[:subject] = subject if subject
    query[:ref_id] = ref_id if ref_id
    query[:ref_type] = ref_type if ref_type
    query
  end

  def build_event_log_user_query(user, subject)
    query = { community_id: user.community_id }
    query[:subject] = subject if subject
    query[:acting_user_id] = user.id
    query
  end

  def query_user_logs(user, subject, limit, offset)
    query = build_event_log_user_query(user, subject)
    context[:site_community].event_logs.eager_load(:acting_user).where(query)
                            .limit(limit).offset(offset)
  end

  def query_logs_with_name(query, name, limit, offset)
    # TODO: Move this search to serchcop
    context[:site_community].event_logs.eager_load(:acting_user).where(query)
                            .where("data->>'ref_name' ILIKE ? OR data->>'note' ILIKE ?",
                                   "%#{name}%", "%#{name}%")
                            .limit(limit).offset(offset)
  end

  def can_fetch_logbook_logs?
    permitted?(module: :event_log, permission: :can_fetch_logbook_events)
  end
end

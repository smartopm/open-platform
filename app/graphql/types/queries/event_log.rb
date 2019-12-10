# frozen_string_literal: true

# Queries module for breaking out queries
module Types::Queries::EventLog
  extend ActiveSupport::Concern

  included do
    field :all_event_logs, [Types::EventLogType], null: true do
      description 'Get event logs for the community'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :subject, [String, null: true], required: false
      argument :ref_id, GraphQL::Types::ID, required: false
      argument :ref_type, String, required: false
    end

    field :all_event_logs_for_user, [Types::EventLogType], null: true do
      description 'Get event logs for actions a user performed'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :subject, [String, null: true], required: false
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  def all_event_logs(offset: 0, limit: 100, subject:, ref_id:, ref_type:)
    authorized = context[:current_user]&.role?(%i[security_guard admin])
    raise GraphQL::ExecutionError, 'Unauthorized' unless authorized

    query = build_event_log_query(context[:current_user], subject, ref_id, ref_type)
    EventLog.where(query)
            .limit(limit).offset(offset)
  end

  def all_event_logs_for_user(offset: 0, limit: 100, subject:, user_id:)
    current_user = context[:current_user]
    authorized = current_user&.role?(%i[security_guard admin])
    raise GraphQL::ExecutionError, 'Unauthorized' unless authorized

    user = User.find(user_id)
    raise GraphQL::ExecutionError, 'Unauthorized' if current_user.community_id != user.community_id

    query = build_event_log_user_query(user, subject)
    EventLog.where(query)
            .limit(limit).offset(offset)
  end

  def build_event_log_query(user, subject, ref_id, ref_type)
    query = {
      community_id: user.community_id,
    }
    query[:subject] = subject if subject
    query[:ref_id] = ref_id if ref_id
    query[:ref_type] = ref_type if ref_type
    query
  end

  def build_event_log_user_query(user, subject)
    query = {
      community_id: user.community_id,
    }
    query[:subject] = subject if subject
    query[:acting_user_id] = user.id
    query
  end
end

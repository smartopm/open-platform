# frozen_string_literal: true

# Queries module for breaking out queries
module Types::Queries::EventLog
  extend ActiveSupport::Concern

  included do
    field :all_event_logs, [Types::EventLogType], null: true do
      description 'Get entry logs for the current_user community'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :subject, String, required: false
      argument :ref_id, GraphQL::Types::ID, required: false
      argument :ref_type, String, required: false
    end
  end

  def all_event_logs(offset: 0, limit: 100, subject:, ref_id:, ref_type:)
    authorized = context[:current_user]&.role?(%i[security_guard admin])
    raise GraphQL::ExecutionError, 'Unauthorized' unless authorized

    query = build_event_log_query(context[:current_user], subject, ref_id, ref_type)
    if authorized
      return EventLog.where(query)
                     .limit(limit).offset(offset)
    end
    raise GraphQL::ExecutionError, 'Not available to this user'
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
end

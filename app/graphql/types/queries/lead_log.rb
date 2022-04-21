# frozen_string_literal: true

# leadlog queries
module Types::Queries::LeadLog
  extend ActiveSupport::Concern

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
  end

  def lead_events(user_id:, offset: 0, limit: 3)
    raise_unauthorized_error_for_lead_logs

    context[:site_community].lead_logs.where(user_id: user_id)
                            .event.includes(:acting_user)
                            .offset(offset).limit(limit)
  end

  def lead_meetings(user_id:, offset: 0, limit: 3)
    raise_unauthorized_error_for_lead_logs

    context[:site_community].lead_logs.where(user_id: user_id)
                            .meeting.includes(:acting_user)
                            .offset(offset).limit(limit)
  end

  def signed_deals(user_id:, offset: 0, limit: 3)
    raise_unauthorized_error_for_lead_logs

    context[:site_community].lead_logs.where(user_id: user_id)
                            .signed_deal.includes(:acting_user)
                            .offset(offset).limit(limit)
  end

  def raise_unauthorized_error_for_lead_logs
    return if permitted?(module: :lead_log, permission: :can_fetch_lead_logs)

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end
end

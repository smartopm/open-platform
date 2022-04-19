# frozen_string_literal: true

module Types::Queries::LeadLog
  extend ActiveSupport::Concern

  included do
    field :events, [Types::LeadLogType], null: true do
      description 'Get lead specific events'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :meetings, [Types::LeadLogType], null: true do
      description 'Get lead specific meetings'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end

    field :signed_deal, Types::LeadLogType, null: true do
      description 'Get signed deal for lead'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  def events(user_id:, offset: 0, limit: 3)
    raise_unauthorized_error_for_lead_logs

    context[:site_community].lead_logs.where(user_id: user_id)
                            .event.includes(:user)
                            .offset(offset).limit(limit)
  end

  def meetings(user_id:, offset: 0, limit: 3)
    raise_unauthorized_error_for_lead_logs

    context[:site_community].lead_logs.where(user_id: user_id)
                            .meeting.includes(:user)
                            .offset(offset).limit(limit)
  end

  def signed_deal(user_id:)
    raise_unauthorized_error_for_lead_logs

    context[:site_community].lead_logs.where(user_id: user_id).signed_deal.includes(:user)
  end

  def raise_unauthorized_error_for_lead_logs
    return if permitted?(module: :lead_log, permission: :can_fetch_lead_logs)

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end
end

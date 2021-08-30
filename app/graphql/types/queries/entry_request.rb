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
  def scheduled_requests
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless admin_or_security_guard

    context[:site_community].entry_requests.where.not(visitation_date: nil)
                            .unscope(:order)
                            .order(created_at: :desc)
  end

  private

  def admin_or_security_guard
    context[:current_user].admin? || context[:current_user].security_guard?
  end
end

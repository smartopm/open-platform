# frozen_string_literal: true

# Campaign queries
module Types::Queries::Campaign
  extend ActiveSupport::Concern

  included do
    field :campaigns, [Types::CampaignType], null: true do
      description 'Get a list of all Campaigns'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    field :campaign, Types::CampaignType, null: true do
      description 'Find Campaign by Id'
      argument :id, GraphQL::Types::ID, required: true
    end
  end

  def campaigns(offset: 0, limit: 50, query: '')
    unless permitted?(module: :campaign,
                      permission: :can_list_campaigns)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].campaigns.existing.search(query).offset(offset).limit(limit)
  end

  def campaign(id:)
    unless permitted?(module: :campaign,
                      permission: :can_get_campaign_details)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].campaigns.find_by(id: id)
  end
end

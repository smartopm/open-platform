module Types::Queries::Campaign
    extend ActiveSupport::Concern

    included do
        field :campaigns, [Types::CampaignType], null: true do
            description 'Get a list of all Campaigns'
            argument :query, String, required: false
            argument :offset, Integer, required: false
            argument :limit, Integer, required: false
        end
        
        def campaigns(query: '', offset: 0, limit: 100)
            raise GraphQL::ExecutionError,'Unauthorized' if context[:current_user].blank?

            campaign = context[:current_user].Campaign.all
            campaign
        end
    end
end
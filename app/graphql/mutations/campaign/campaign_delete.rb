# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignDelete
    class CampaignDelete < BaseMutation
      argument :id, ID, required: true

      field :campaign, Types::CampaignType, null: true

      def resolve(vals)
        campaign = context[:site_community].campaigns.find(vals[:id])
        campaign&.deleted!
        return { campaign: campaign.reload } if campaign

        raise GraphQL::ExecutionError, campaign.errors.full_message
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end

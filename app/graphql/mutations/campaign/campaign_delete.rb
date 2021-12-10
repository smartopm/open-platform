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

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :campaign,
                                  permission: :can_delete_campaign)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

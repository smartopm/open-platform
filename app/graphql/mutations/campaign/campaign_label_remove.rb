# frozen_string_literal: true

module Mutations
  module Campaign
    # Create a new Label for the user
    class CampaignLabelRemove < BaseMutation
      argument :campaign_id, ID, required: true
      argument :label_id, ID, required: true

      field :campaign, Types::CampaignType, null: true

      def resolve(campaign_id:, label_id:)
        campaign = context[:site_community].campaigns.find(campaign_id)
        record = campaign.campaign_labels.find_by(label_id: label_id)

        return { campaign: campaign } if record.nil? || record.destroy

        raise GraphQL::ExecutionError, record.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :campaign,
                                  permission: :can_remove_campaign_label)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

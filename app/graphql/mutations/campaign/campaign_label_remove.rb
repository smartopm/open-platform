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

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

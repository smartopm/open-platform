# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignUpdate
    class CampaignUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :message, String, required: false
      argument :batch_time, String, required: false
      argument :user_id_list, String, required: false

      field :campaign, Types::CampaignType, null: true

      def resolve(id:, **vals)
        campaign = ::Campaign.find(id)
        return if campaign.nil?

        campaign.update!(vals)

        return { campaign: campaign } if campaign.persisted?

        raise GraphQL::ExecutionError, campaign.errors.full_message
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

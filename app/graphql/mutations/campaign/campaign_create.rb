# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreate < BaseMutation
      argument :name, String, required: true
      argument :message, String, required: true
      argument :batch_time, String, required: true
      argument :user_id_list, String, required: true

      field :campaign, Types::CampaignType, null: true

      def resolve(vals)
        campaign = context[:current_user].community.campaigns.new
        campaign.name = vals[:name]
        campaign.message = vals[:message]
        campaign.user_id_list = vals[:user_id_list]
        campaign.batch_time = vals[:batch_time]
        campaign.save!
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

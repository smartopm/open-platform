# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreateThroughUsers < BaseMutation
      include Helpers::Campaign

      argument :user_id, String, required: true

      field :campaign, Types::CampaignType, null: true

      # TODO: Move campaign create process to a background job
      def resolve(user_id:)
        campaign = campaign_object
        campaign.name = I18n.t('campaign.default_name')
        campaign.user_id_list = user_id
        raise GraphQL::ExecutionError, campaign.errors.full_message unless campaign.save!

        { campaign: campaign }
      end

      def campaign_object
        campaign = context[:current_user].community.campaigns.new
        campaign.campaign_type = 'sms'
        campaign.status = 'draft'
        campaign.message = I18n.t('campaign.default_message')
        campaign.batch_time = 10.years.from_now
        campaign
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

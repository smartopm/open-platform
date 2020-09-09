# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreateThroughUsers < BaseMutation
      include Helpers::Campaign

      argument :filters, String, required: true
      argument :user_id_list, String, required: true

      field :campaign, Types::CampaignType, null: true

      def resolve(vals)
        campaign = campaign_object
        campaign.name = vals[:filters].tr(',', '_')
        campaign.user_id_list = vals[:user_id_list]
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

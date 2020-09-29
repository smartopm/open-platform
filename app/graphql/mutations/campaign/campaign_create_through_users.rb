# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreateThroughUsers < BaseMutation
      include Helpers::Campaign

      argument :labels, String, required: false
      argument :user_type, String, required: false

      field :campaign, Types::CampaignType, null: true

      def resolve(vals)
        campaign = campaign_object
        campaign.name = campaign_name(vals[:labels])
        campaign.user_id_list = user_id_list(vals).pluck(:id).join(',')
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

      def campaign_name(labels)
        labels ? labels.tr(',', '_') : I18n.t('campaign.default_name')
      end

      def user_id_list(vals)
        labels = vals[:labels]&.split(',')
        user_types = vals[:user_type]&.split(',')
        return ::User.all if labels.nil? && user_types.nil?
        return ::User.joins(:labels).where('labels.short_desc IN (?)', labels) if user_types.nil?
        return ::User.where('user_type IN (?)', user_types) if labels.nil?

        ::User.joins(:labels).where('labels.short_desc IN (?) AND user_type IN (?)',
          labels, user_types).pluck(:id).join(',')
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

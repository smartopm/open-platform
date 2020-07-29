# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreate < BaseMutation
      include Helpers::Campaign

      argument :name, String, required: true
      argument :message, String, required: true
      argument :batch_time, String, required: true
      argument :user_id_list, String, required: true
      argument :labels, String, required: false

      field :campaign, Types::CampaignType, null: true

      # TODO: Rollback if Label fails to save - Saurabh
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        campaign = context[:current_user].community.campaigns.new
        campaign.name = vals[:name]
        campaign.message = vals[:message]
        campaign.user_id_list = vals[:user_id_list]
        campaign.batch_time = vals[:batch_time]
        raise GraphQL::ExecutionError, campaign.errors.full_message unless campaign.save!

        labels = Array(vals[:labels]&.split(',')).map(&:downcase)
        labels.each { |label| create_campaign_label(campaign, label) }
        return { campaign: campaign } if campaign.persisted?
      end
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

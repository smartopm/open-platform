# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreateThroughUsers < BaseMutation
      include Helpers::Campaign

      argument :query, String, required: false
      argument :limit, Integer, required: false

      field :campaign, Types::CampaignType, null: true

      # TODO: Move campaign create process to a background job
      def resolve(query:, limit:)
        campaign = campaign_object
        campaign.name = I18n.t('campaign.default_name')
        campaign.user_id_list = list_of_user_ids(query, limit)
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

      def list_of_user_ids(query, limit)
        users = if query.present? && query.include?('date_filter')
                  ::User.allowed_users(context[:current_user])
                      .heavy_search(query)
                else
                  ::User.allowed_users(context[:current_user])
                      .search(query)
                end

        # Check Later @nurudeen!
        # .heavy_search & .search returns duplicates when .pluck is used on them, a bug?
        users.order(name: :asc).limit(limit).pluck(:id).uniq
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

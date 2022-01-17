# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreateThroughUsers < BaseMutation
      include Helpers::Campaign

      argument :query, String, required: false
      argument :limit, Integer, required: false
      argument :user_list, String, required: false

      field :campaign, Types::CampaignType, null: true

      # TODO: Move campaign create process to a background job
      def resolve(query:, limit:, user_list:)
        campaign = campaign_object
        campaign.name = I18n.t('campaign.default.name')
        campaign.user_id_list = user_list.presence || list_of_user_ids(query, limit).join(',')
        raise GraphQL::ExecutionError, campaign.errors.full_message unless campaign.save!

        { campaign: campaign }
      end

      def campaign_object
        campaign = context[:current_user].community.campaigns.new
        campaign.campaign_type = 'sms'
        campaign.status = 'draft'
        campaign.message = I18n.t('campaign.default.message')
        campaign.batch_time = Time.current
        campaign
      end

      def list_of_user_ids(query, limit)
        users = if query.present? && query.include?('date_filter')
                  Users::User.allowed_users(context[:current_user]).heavy_search(query)
                else
                  Users::User.allowed_users(context[:current_user]).search(query)
                end

        # Check Later @nurudeen!
        # .heavy_search & .search returns duplicates when .pluck is used on them, a bug?
        users.order(name: :asc).limit(limit).pluck(:id).uniq
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :campaign,
                                  permission: :can_create_campaign_through_users)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

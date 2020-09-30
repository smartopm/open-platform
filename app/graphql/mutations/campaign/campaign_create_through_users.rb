# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreateThroughUsers < BaseMutation
      include Helpers::Campaign

      argument :labels, String, required: false
      argument :user_type, String, required: false
      argument :number, String, required: false

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

      # rubocop:disable Metrics/AbcSize
      def user_id_list(vals)
        vals.delete_if { |_key, value| value.nil? }
        return context[:site_community].users.all if vals.empty?
        return user_by_single_filter(vals) if vals.length.eql? 1
        return user_by_double_filter(vals) if vals.length.eql? 2

        context[:site_community].users.joins(:labels).by_phone_number(vals[:number])
                                .by_type(vals[:user_type]).by_labels(vals[:labels])
      end

      def user_by_single_filter(vals)
        return context[:site_community].users.by_labels(vals[:labels]) if vals.key?(:labels)
        return context[:site_community].users.by_type(vals[:user_type]) if vals.key?(:user_type)

        context[:site_community].users.by_phone_number(vals[:number]) if vals.key?(:number)
      end

      def user_by_double_filter(vals)
        if vals.key?(:user_type) && vals.key?(:labels)
          return context[:site_community].users.by_type(vals[:user_type]).by_labels(vals[:labels])
        end

        if vals.key?(:user_type) && vals.key?(:number)
          return context[:site_community].users.by_type(vals[:user_type])
                                         .by_phone_number(vals[:number])
        end
        context[:site_community].users.by_phone_number(vals[:number]).by_labels(vals[:labels])
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

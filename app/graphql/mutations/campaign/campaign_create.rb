# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreate < BaseMutation
      include Helpers::Campaign

      argument :name, String, required: true
      argument :message, String, required: true
      argument :campaign_type, String, required: true
      argument :batch_time, String, required: true
      argument :user_id_list, String, required: true
      argument :labels, String, required: false
      argument :subject, String, required: false
      argument :pre_header, String, required: false
      argument :template_style, String, required: false

      field :campaign, Types::CampaignType, null: true

      # TODO: Rollback if Label fails to save - Saurabh
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        campaign = context[:current_user].community.campaigns.new(
          name: vals[:name],
          campaign_type: vals[:campaign_type],
          message: vals[:message],
          user_id_list: vals[:user_id_list],
          batch_time: vals[:batch_time]
        )
        campaign = add_email_attributes(campaign, vals) if vals[:campaign_type].eql?('email')
        raise GraphQL::ExecutionError, campaign.errors.full_message unless campaign.save!

        labels = Array(vals[:labels]&.split(',')).map(&:downcase)
        labels.each { |label| create_campaign_label(campaign, label) }
        return { campaign: campaign } if campaign.persisted?
      end
      # rubocop:enable Metrics/AbcSize

      def add_email_attributes(campaign, vals)
        %w[subject pre_header template_style].each do |attr|
          raise GraphQL::ExecutionError, "#{attr} Required" if vals[attr.to_sym].blank?

          campaign.send("#{attr}=", vals[attr.to_sym])
        end
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

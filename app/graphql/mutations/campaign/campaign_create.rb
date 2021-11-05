# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreate < BaseMutation
      include Helpers::Campaign

      argument :name, String, required: true
      argument :message, String, required: false
      argument :campaign_type, String, required: true
      argument :status, String, required: true
      argument :email_templates_id, ID, required: false
      argument :batch_time, String, required: false
      argument :user_id_list, String, required: false
      argument :labels, String, required: false
      argument :include_reply_link, Boolean, required: false

      field :campaign, Types::CampaignType, null: true

      # TODO: Rollback if Label fails to save - Saurabh
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        check_missing_args(vals) if vals[:status] == 'scheduled'
        campaign = context[:current_user].community.campaigns.new
        campaign = add_attributes(campaign, vals)
        raise GraphQL::ExecutionError, campaign.errors.full_message unless campaign.save!

        labels = Array(vals[:labels]&.split(',')).map(&:downcase)
        labels.each { |label| create_campaign_label(campaign, label) }
        return { campaign: campaign } if campaign.persisted?
      end
      # rubocop:enable Metrics/AbcSize

      def add_attributes(campaign, vals)
        %w[name campaign_type message user_id_list batch_time
           status include_reply_link email_templates_id].each do |attr|
          next if vals[attr.to_sym].blank?

          campaign.send("#{attr}=", vals[attr.to_sym])
        end

        campaign
      end

      def check_missing_args(vals)
        attributes = %w[name campaign_type message user_id_list batch_time status]
        attributes.push('email_templates_id') if vals[:campaign_type].eql?('email')
        attributes.each do |attr|
          next if vals[attr.to_sym].present?

          raise GraphQL::ExecutionError,
                I18n.t('errors.campaign.missing_parameter', attribute: attr)
        end
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(
          admin: true,
          module: :campaign,
          permission: :can_create_campaign,
        )

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

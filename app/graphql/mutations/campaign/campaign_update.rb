# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignUpdate
    class CampaignUpdate < BaseMutation
      include Helpers::Campaign

      argument :id, ID, required: true
      argument :name, String, required: false
      argument :message, String, required: false
      argument :batch_time, String, required: false
      argument :user_id_list, String, required: false
      argument :labels, String, required: false

      field :campaign, Types::CampaignType, null: true

      def resolve(id:, **vals)
        campaign = ::Campaign.find(id)
        return if campaign.nil?

        update_campaign_label(campaign, vals.delete(:labels)&.split(','))
        campaign.update!(vals)

        return { campaign: campaign } if campaign.persisted?

        raise GraphQL::ExecutionError, campaign.errors.full_message
      end

      def update_campaign_label(campaign, labels)
        labels = labels&.map(&:downcase)
        Array(labels).each do |label|
          next if campaign_label_exists?(campaign, label)

          create_campaign_label(campaign, label)
        end
        remove_campaign_label(campaign, Array(campaign.labels&.pluck(:short_desc)) - Array(labels))
      end

      def remove_campaign_label(campaign, labels)
        labels.each do |label|
          label_record = context[:site_community].labels.find_by(short_desc: label)
          relation = CampaignLabel.find_by(campaign_id: campaign.id, label_id: label_record.id)
          raise GraphQL::ExecutionError, relation.errors.full_message unless relation.destroy
        end
      end

      def campaign_label_exists?(campaign, label_text)
        campaign_labels = campaign.labels
        return false if campaign_labels.empty?

        campaign_labels.pluck(:short_desc).include?(label_text)
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

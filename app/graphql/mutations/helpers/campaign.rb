# frozen_string_literal: true

module Mutations
  module Helpers
    # Helper methods for campaign mutations
    module Campaign
      def create_campaign_label(campaign, label)
        existing_label = Labels::Label.find_by(short_desc: label)
        return map_campaign_to_label(campaign, existing_label) if existing_label.present?

        label = context[:site_community].labels.new(short_desc: label)
        return map_campaign_to_label(campaign, label) if label.save!

        raise GraphQL::ExecutionError, label.errors.full_messages&.join(', ')
      end

      def map_campaign_to_label(campaign, existing_label)
        Labels::CampaignLabel.create!(campaign_id: campaign.id, label_id: existing_label.id)
      end

      def check_missing_args(vals)
        attributes = %w[name campaign_type message user_id_list batch_time status]
        attributes.push('email_templates_id') if vals[:campaign_type].eql?('email')
        attributes.each do |attr|
          next if vals[attr.to_sym].present?

          raise GraphQL::ExecutionError,
                I18n.t('errors.campaign.missing_parameter', attribute: attr.titleize)
        end
      end
    end
  end
end

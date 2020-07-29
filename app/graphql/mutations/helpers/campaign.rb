# frozen_string_literal: true

module Mutations
  module Helpers
    # Helper methods for campaign mutations
    module Campaign
      def create_campaign_label(campaign, label)
        existing_label = ::Label.find_by(short_desc: label)
        return map_campaign_to_label(campaign, existing_label) if existing_label.present?

        label = context[:site_community].labels.new(short_desc: label)
        return map_campaign_to_label(campaign, label) if label.save!

        raise GraphQL::ExecutionError, label.errors.full_message
      end

      def map_campaign_to_label(campaign, existing_label)
        CampaignLabel.create!(campaign_id: campaign.id, label_id: existing_label.id)
      end
    end
  end
end

# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignCreate
    class CampaignCreate < BaseMutation
      argument :name, String, required: true
      argument :message, String, required: true
      argument :batch_time, String, required: true
      argument :user_id_list, String, required: true
      argument :labels, String, required: false

      field :campaign, Types::CampaignType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        campaign = context[:current_user].community.campaigns.new
        campaign.name = vals[:name]
        campaign.message = vals[:message]
        campaign.user_id_list = vals[:user_id_list]
        campaign.batch_time = vals[:batch_time]
        campaign.save!
        Array(vals[:labels]&.split(',')).each { |label| create_label(campaign, label) }
        return { campaign: campaign } if campaign.persisted?

        raise GraphQL::ExecutionError, campaign.errors.full_message
      end
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end

      def create_label(campaign, label)
        existing_label = Label.find_by(short_desc: label)
        return associate_label(campaign, existing_label) if existing_label.present?

        label = context[:site_community].labels.new(short_desc: label)
        return associate_label(campaign, label) if label.save!

        raise GraphQL::ExecutionError, 'Something went wrong'
      end

      def associate_label(campaign, existing_label)
        CampaignLabel.new(campaign_id: campaign.id, label_id: existing_label.id).save!
      end
    end
  end
end

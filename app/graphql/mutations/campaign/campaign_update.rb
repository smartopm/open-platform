# frozen_string_literal: true

module Mutations
  module Campaign
    # CampaignUpdate
    class CampaignUpdate < BaseMutation
      include Helpers::Campaign

      argument :id, ID, required: true
      argument :name, String, required: false
      argument :campaign_type, String, required: false
      argument :status, String, required: false
      argument :email_templates_id, ID, required: false
      argument :message, String, required: false
      argument :batch_time, String, required: false
      argument :user_id_list, String, required: false
      argument :labels, String, required: false
      argument :include_reply_link, Boolean, required: false

      field :campaign, Types::CampaignType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(id:, **vals)
        check_missing_args(vals) if vals[:status] == 'scheduled'
        campaign = context[:site_community].campaigns.find_by(id: id)
        return if campaign.nil?

        raise_campaign_in_progress_error(campaign)

        old_status = campaign.status
        update_campaign_label(campaign, vals.delete(:labels)&.split(','))

        if campaign.update(vals)
          campaign.schedule_campaign_job(old_status)
          return { campaign: campaign.reload }
        end

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
          relation = Labels::CampaignLabel.find_by(campaign_id: campaign.id,
                                                   label_id: label_record.id)
          raise GraphQL::ExecutionError, relation.errors.full_message unless relation.destroy
        end
      end

      def campaign_label_exists?(campaign, label_text)
        campaign_labels = campaign.labels
        return false if campaign_labels.empty?

        campaign_labels.pluck(:short_desc).include?(label_text)
      end

      def raise_campaign_in_progress_error(campaign)
        return if %w[in_progress done].exclude?(campaign.status)

        raise GraphQL::ExecutionError,
              "#{campaign_error_message(campaign)} #{I18n.t('errors.campaign.create_new_campaign')}"
      end

      def campaign_error_message(campaign)
        return I18n.t('errors.campaign.campaign_completed') if campaign.status.eql?('done')

        I18n.t('errors.campaign.in_progress')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :campaign,
                                  permission: :can_update_campaign)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength
    end
  end
end

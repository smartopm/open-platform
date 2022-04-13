# frozen_string_literal: true

require 'email_msg'
# Updates total opened and clicked
class CampaignMetricsJob < ApplicationJob
  queue_as :default

  def perform
    Campaign.email_campaigns.done
            .where('end_time > ?', Time.zone.now - 15.days).find_each do |campaign|
      total_opened, total_clicked = calculate_stats(campaign)
      if metrics_changed?(campaign, total_clicked, total_opened)
        campaign.update({ total_opened: total_opened, total_clicked: total_clicked })
      end
    end
  end

  # rubocop:disable Metrics/MethodLength
  def calculate_stats(campaign)
    total_opened = 0
    total_clicked = 0
    batches = (campaign.target_list.uniq.size / 1000.0).ceil

    batches.times do |batch|
      unique_id = "#{campaign.id}*#{batch}"
      EmailMsg.email_stats('campaign_id', unique_id)&.each do |response|
        total_opened += response['opens_count']&.positive? ? 1 : 0
        total_clicked += response['clicks_count']&.positive? ? 1 : 0
      end
    end
    [total_opened, total_clicked]
  end
  # rubocop:enable Metrics/MethodLength

  # Returns boolean value based on change in campaign stats
  # * If API returns nil for some reason, we don't want the original stats to update to 0
  #
  # @return [Boolean]
  def metrics_changed?(campaign, total_clicked, total_opened)
    total_opened > campaign.total_opened ||
      total_clicked > campaign.total_clicked || 0
  end
end

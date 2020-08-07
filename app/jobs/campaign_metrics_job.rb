# frozen_string_literal: true

# Updates total clicked value in campaign records
class CampaignMetricsJob < ApplicationJob
  queue_as :default

  def perform(campaign_id, user_id_list)
    campaign = Campaign.find(campaign_id)
    return if campaign.expired? || campaign.batch_time.blank?

    clicks_count = EventLog.since_date(campaign.start_time).by_user_activity
                           .with_acting_user_id(user_id_list.split(',')).count
    update_clicks(campaign, clicks_count)
  end

  private

  def update_clicks(campaign, clicks_count)
    if campaign.update(total_clicked: clicks_count)
      return CampaignMetricsJob.set(wait: 2.hours).perform_later(campaign.id, user_id_list)
    end

    Rollbar.error "Count Update Failed #{campaign_id}"
  end
end

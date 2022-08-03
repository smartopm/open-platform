# frozen_string_literal: true

# Sends out campaign at specified time
class CampaignSchedulerJob < ApplicationJob
  queue_as :default

  def perform(campaign_id)
    campaign = Campaign.find_by(id: campaign_id)
    return unless campaign.present? && %w[scheduled in_progress].include?(campaign.status)

    if campaign.batch_time > Time.current + 2.minutes
      CampaignSchedulerJob.set(wait_until: campaign.batch_time)
                          .perform_later(campaign.id)
    else
      campaign.run_campaign
    end
  end
end

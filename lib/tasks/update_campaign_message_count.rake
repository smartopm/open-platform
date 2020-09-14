# frozen_string_literal: true

desc 'update message count in all campaigns'
task update_campaign_message_count: :environment do
  Campaign.all.each do |campaign|
    count = campaign.messages.count

    raise StandardError, 'Campaign update failed' unless campaign.update(message_count: count)
  end
end

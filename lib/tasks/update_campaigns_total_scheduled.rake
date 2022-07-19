# frozen_string_literal: true

namespace :db do
  desc 'Update campaigns total scheduled'
  task update_campaigns_total_scheduled: :environment do
    Community.find_each do |community|
      community.campaigns.where(total_scheduled: 0).find_each do |campaign|
        campaign.update!(total_scheduled: campaign.target_list.uniq.size)
      end
    end
    puts 'Total scheduled updated successfully'
  rescue StandardError => e
    puts 'Failed to update total scheduled'
    puts e.message.to_s
  end
end

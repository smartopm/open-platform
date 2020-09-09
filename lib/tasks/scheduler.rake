# frozen_string_literal: true

desc 'campaign messaging SMS'
task campaign_sms: :environment do
  puts 'campaign sms'
  Campaign.scheduled.where(end_time: nil)
          .where(Campaign.arel_table[:batch_time].lteq(Time.current))
          .each do |cc|
    puts "Running #{cc.name} #{cc.end_time}"
    cc.run_campaign
    puts "Done running #{cc.name}"
  end
end

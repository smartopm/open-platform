# frozen_string_literal: true

namespace :db do
  desc 'Create a new community'
  task :create_communty, %i[community_name currency timezone] => :environment do |_t, args|
    unless args.community_name.present? && args.currency.present?
      abort('Community Name and Currency are required')
    end
    # Create a community with basic fields, the rest can be added from the UI
    Community.create!(
      name: args.community_name,
      currency: args.currency,
      timezone: args.timezone,
      hostname: "#{args.community_name.downcase}.doublegdp.com",
    )
  end
end

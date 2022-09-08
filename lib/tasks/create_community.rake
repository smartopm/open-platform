# frozen_string_literal: true

namespace :db do
  desc 'Create a new community'
  task :create_community, %i[community_name] => :environment do |_t, args|
    unless args.community_name
      abort('Community name is required')
    end
    # Create a community with basic fields, the rest can be added from the UI
    Community.create!(
      name: args.community_name,
      currency: 'american_dollar',
      theme_colors: {"primaryColor" => "#53A2BE", "secondaryColor" => "#1E4785"}
    )
  end
end

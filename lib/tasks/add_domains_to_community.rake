# frozen_string_literal: true

namespace :db do
  desc 'Add domains to community'
  task add_domains_to_community: :environment do
    community_list = { 'app.doublegdp.com' => 'Nkwashi',
                       'double-gdp-staging.herokuapp.com' => 'Nkwashi',
                       'demo.doublegdp.com' => 'DoubleGDP',
                       'demo-staging.doublegdp.com' => 'DoubleGDP',
                       'morazancity.doublegdp.com' => 'Ciudad Morazán',
                       'morazancity-staging.doublegdp.com' => 'Ciudad Morazán',
                       'tilisi-staging.doublegdp.com' => 'Tilisi',
                       'tilisi.doublegdp.com' => 'Tilisi',
                       'greenpark.doublegdp.com' => 'Greenpark',
                       'greenpark-staging.doublegdp.com' => 'Greenpark',
                       'enyimba.doublegdp.com' => 'Enyimba',
                       'enyimba-staging.doublegdp.com' => 'Enyimba',
                       'dev.dgdp.site' => 'DoubleGDP',
                       'double-gdp-dev.herokuapp.com' => 'DAST' }

    ActiveRecord::Base.transaction do
      community_list.each do |key, value|
        community = Community.find_by(name: value)
        next if community.nil? || community.domains.include?(key)

        community.domains.push(key)
        community.save!
        puts "Added domain for #{value}"
      end
      puts 'Added domains for all communities'
    end
  rescue StandardError => e
    puts 'Failed to add domain for a community'
    puts e.message.to_s
  end
end

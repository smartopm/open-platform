# frozen_string_literal: true

# rubocop:disable Layout/LineLength
namespace :import do
  desc 'Migrate Points of Interest'
  task :migrate_poi, %i[origin_community_name destination_community_name] => :environment do |_t, args|
    unless args.origin_community_name && args.destination_community_name
      abort('Provide Community names [from_community1,to_commmunity2}')
    end

    origin_community = Community.find_by(name: args.origin_community_name)
    destination_community = Community.find_by(name: args.destination_community_name)
    unless origin_community && destination_community
      abort('Origin and/or Destination community not found')
    end

    poi_id_list = %w[
      POI-52925
      POI-65342
      POI-13612
      POI-31483
      POI-23663
      POI-45051
      POI-40610
    ]

    ActiveRecord::Base.transaction do
      poi_id_list.each do |id|
        poi = origin_community.land_parcels.find_by(parcel_number: id)

        if poi.blank?
          puts "point of interest #{id} not found"
          next
        end

        poi.update!(community_id: destination_community.id)
      end
      puts "Done Successfully. #{poi_id_list.size} migrated to #{args.destination_community_name}"
    end
  end
end
# rubocop:enable Layout/LineLength

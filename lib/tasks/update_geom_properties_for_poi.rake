# frozen_string_literal: true

# rubocop:disable Rails/SkipsModelValidations
namespace :db do
  desc 'Update Geom Fields'
  task :update_geom_properties_for_poi, %i[community_name] => :environment do |_t, args|
    abort('Community name undefined') if args.community_name.blank?

    community = Community.find_by(name: args.community_name)
    abort('Community undefined') if community.blank?

    poi_id_list = %w[
      POI-99782
      POI-20137
      POI-12662
      POI-59447
      POI-17075
    ]

    ActiveRecord::Base.transaction do
      poi_id_list.each do |id|
        poi = community.land_parcels.excluding_general.find_by(parcel_number: id)

        if poi.blank?
          puts "point of interest #{id} not found"
          next
        end

        geom_to_update = JSON.parse(poi.geom)
        puts "befor update #{geom_to_update} \n*****"

        geom_to_update['properties']['icon'] = 'https://cdn4.iconfinder.com/data/icons/logistics-and-transport-1/24/icn-place-stop-512.png'

        puts "After update #{geom_to_update.to_json}"

        poi.update_column(:geom, geom_to_update.to_json)
        puts "Updated #{poi.parcel_number}"
      end
    end

    puts 'Done. Successfully'
  end
end
# rubocop:enable Rails/SkipsModelValidations

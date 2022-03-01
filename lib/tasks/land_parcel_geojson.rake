# frozen_string_literal: true

require 'parcel_indexer'

namespace :db do
  namespace :seed do
    desc 'Load GeoJSON parcel data into database'
    task :land_parcel_geojson, %i[community_name] => :environment do |_t, args|
      abort('Community Name required') unless args.community_name

      community = Community.find_by(name: args.community_name)
      abort('Community not found') unless community

      dir = Rails.root.join('app/javascript/src/data')
      src_file = 'doublegdp_plots.json'
      json_file = "#{dir}/#{src_file}"

      abort("Aborted. File not found - #{json_file}") unless File.exist?(json_file)

      geojson_data = JSON.parse(File.read(json_file))
      features = geojson_data['features']

      ActiveRecord::Base.transaction do
        features.each do |f|
          # enusre the geojson structure is well formed
          abort('Aborted. Ivalid GeoJSON feature type') unless f['type'].eql?('Feature')
          abort('Aborted. No valid geometry found.') unless f['geometry']
          if f['geometry'].empty?
            abort('Aborted. Invalid GeoJSON feature type::Geometry type cannot be empty')
          end

          # ensure the geometry type is Polygon
          geometry_type = f['geometry']['type']
          unless geometry_type.eql?('Polygon')
            abort("Aborted. Invalid GeoJSON feature type::Geometry type must be
              of SFC \'Polygon\' at - #{geometry_type}")
          end

          unique_record = false
          max_attempts = 3
          attempts = 1

          # ensure that parcel_no is unique during migration
          until unique_record
            if attempts > max_attempts
              abort("Aborted. Land Parcel record not unique after #{max_attempts} attempts.")
            end

            parcel_no = ParcelIndexer.generate_parcel_no(parcel_type: 'basic')
            land_parcel = Properties::LandParcel.find_by(parcel_number: parcel_no)

            if land_parcel.present?
              attempts += 1
            else
              unique_record = true
            end
          end

          long_x = f['properties']['long_x']
          lat_y = f['properties']['lat_y']

          # check if the same land parcel has been migrated for this community
          # 2 polygons will not have the same center point(x,y) unless the are duplicates
          duplicate_parcel = Properties::LandParcel.find_by(community_id: community.id,
                                                            long_x: long_x, lat_y: lat_y)
          if duplicate_parcel.present?
            abort("Aborted: Land Parcel already exists. Have you migrated before?
              at Parcel No: #{duplicate_parcel.parcel_number}, long_x: #{duplicate_parcel[:long_x]},
              lat_y: #{duplicate_parcel[:lat_y]}")
          end

          Properties::LandParcel.create!(community_id: community.id,
                                         parcel_number: parcel_no,
                                         parcel_type: 'basic',
                                         geom: f.to_json,
                                         long_x: long_x,
                                         lat_y: lat_y)
        end
      end
      puts "Done. Migrated #{features.size} records"
    end
  end
end

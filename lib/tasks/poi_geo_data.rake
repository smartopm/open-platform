# frozen_string_literal: true

require 'parcel_indexer'

namespace :db do
  namespace :seed do
    desc 'Load GeoJSON Point of Interest data into database'
    task poi_geo_data: :environment do
      dir = Rails.root.join('app/javascript/src/data')
      src_file = 'nkwashi_sculpture_poi.json'
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
          unless geometry_type.eql?('Polygon') || geometry_type.eql?('Point')
            abort("Aborted. Invalid GeoJSON feature type::Geometry type must be
              of SFC \'Polygon\' or SFC \'Point\' at - #{geometry_type}")
          end

          unique_record = false
          max_attempts = 3
          attempts = 1

          # ensure that parcel_no is unique during migration
          until unique_record
            if attempts > max_attempts
              abort("Aborted. Land Parcel record not unique after #{max_attempts} attempts.")
            end

            parcel_no = ParcelIndexer.generate_parcel_no(parcel_type: 'poi')
            land_parcel = Properties::LandParcel.find_by(parcel_number: parcel_no)

            if land_parcel.present?
              attempts += 1
            else
              unique_record = true
            end
          end

          long_x = f['properties']['long_x']
          lat_y = f['properties']['lat_y']
          community_id = Community.find_by(name: 'Nkwashi')&.id

          # check if the same land parcel has been migrated for this community
          # 2 polygons will not have the same center point(x,y) unless the are duplicates
          duplicate_parcel = Properties::LandParcel.find_by(community_id: community_id,
                                                            long_x: long_x, lat_y: lat_y)
          if duplicate_parcel.present?
            abort("Aborted: Land Parcel already exists. Have you migrated before?
              at Parcel No: #{duplicate_parcel.parcel_number}")
          end

          Properties::LandParcel.create!(community_id: community_id,
                                         parcel_number: parcel_no,
                                         parcel_type: 'poi',
                                         geom: f.to_json,
                                         long_x: long_x,
                                         lat_y: lat_y)
        end
      end
      puts "Done. Migrated #{features.size} records"
    end
  end
end

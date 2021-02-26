# frozen_string_literal: true

module Mutations
  module LandParcel
    # Create a new Land Parcel
    class PropertyUpdate < BaseMutation
      argument :id, ID, required: true
      argument :parcel_number, String, required: true
      argument :address1, String, required: false
      argument :address2, String, required: false
      argument :city, String, required: false
      argument :postal_code, String, required: false
      argument :state_province, String, required: false
      argument :parcel_type, String, required: false
      argument :country, String, required: false
      argument :long_x, Float, required: false
      argument :lat_y, Float, required: false
      argument :geom, GraphQL::Types::JSON, required: false
      argument :valuation_fields, GraphQL::Types::JSON, required: false
      argument :ownership_fields, GraphQL::Types::JSON, required: false

      field :land_parcel, Types::LandParcelType, null: true

      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        land_parcel = context[:site_community].land_parcels.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, 'Land Parcel not found' unless land_parcel

        ActiveRecord::Base.transaction do
          land_parcel.update!(
            vals.except(:valuation_fields, :ownership_fields),
          )

          land_parcel.valuations.delete_all
          land_parcel.land_parcel_accounts.delete_all

          Array.wrap(vals[:valuation_fields]).each do |v|
            land_parcel.valuations.create!(amount: v['amount'], start_date: v['startDate'])
          end

          Array.wrap(vals[:ownership_fields]).each do |v|
            land_parcel.accounts.create!(user_id: v['userId'],
                                         full_name: v['name'],
                                         address1: v['address'],
                                         community_id: context[:site_community].id)
          end
          { land_parcel: land_parcel }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.message
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

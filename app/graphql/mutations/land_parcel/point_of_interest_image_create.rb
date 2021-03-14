# frozen_string_literal: true

module Mutations
  module LandParcel
    IMAGE_ATTACHMENTS = {
      image_blob_id: :image,
    }.freeze
    # Upload Photo for a POI
    class PointOfInterestImageCreate < BaseMutation
      argument :id, ID, required: true
      argument :image_blob_id, String, required: true

      field :land_parcel, Types::LandParcelType, null: true

      def resolve(vals)
        land_parcel = context[:site_community]
                      .land_parcels
                      .where(parcel_type: 'poi')
                      .find_by(id: vals[:id])
        raise GraphQL::ExecutionError, 'Land Parcel not found' unless land_parcel

        attach_image(land_parcel, vals)

        return { land_parcel: land_parcel } if land_parcel.image.attached?

        raise GraphQL::ExecutionError, land_parcel.errors.full_messages
      end

      # def attach_image(land_parcel, vals)
      #   IMAGE_ATTACHMENTS.each_pair do |key, attr|
      #     land_parcel.send(attr).attach(vals[key]) if vals[key]
      #   end
      # end

      def attach_image(land_parcel, vals)
        land_parcel.image.attach(vals[:image_blob_id]) if vals[:image_blob_id]
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

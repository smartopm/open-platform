# frozen_string_literal: true

module Mutations
  module LandParcel
    # Update Point of Interest
    class PointOfInterestUpdate < BaseMutation
      argument :id, ID, required: true
      argument :long_x, Float, required: false
      argument :lat_y, Float, required: false
      argument :geom, String, required: false
      argument :image_blob_ids, [String], required: false

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        ActiveRecord::Base.transaction do
          poi = context[:site_community].land_parcels.find(vals.delete(:id))

          if poi.update(vals.except(:image_blob_ids))
            remove_attachments(poi, vals)
            add_attachments(poi, vals)
            return { success: true }
          end

          raise GraphQL::ExecutionError, poi.errors.full_messages
        end
      end

      def add_attachments(poi, vals)
        return if poi.nil?

        poi.images.attach(vals[:image_blob_ids]) if vals[:image_blob_ids].present?
      end

      def remove_attachments(poi, vals)
        return if poi.nil?

        poi.images.purge if vals[:image_blob_ids].present? && poi.images.attached?
      end

      # Verifies current user permission.
      def authorized?(_vals)
        return true if permitted?(module: :land_parcel, permission: :can_update_point_of_interest)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

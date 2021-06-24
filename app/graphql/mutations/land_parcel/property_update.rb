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
      argument :payment_plan_fields, GraphQL::Types::JSON, required: false

      field :land_parcel, Types::LandParcelType, null: true

      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        land_parcel = context[:site_community].land_parcels.find_by(id: vals[:id])
        raise_land_parcel_not_found_error(land_parcel)

        ActiveRecord::Base.transaction do
          land_parcel.update!(
            vals.except(:valuation_fields, :ownership_fields, :payment_plan_fields),
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

          create_payment_plan(vals[:payment_plan_fields]) if vals[:payment_plan_fields].present?
          { land_parcel: land_parcel }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.message
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      def create_payment_plan(params)
        vals = payment_plan_values(params)

        user = context[:site_community].users.find(vals[:user_id])
        raise_user_not_found_error(user)

        payment_plan = user.payment_plans.create!(vals.except(:user_id))
        return if payment_plan.persisted?

        raise GraphQL::ExecutionError, payment_plan.errors.full_messages
      rescue ActiveRecord::RecordNotUnique
        raise GraphQL::ExecutionError,
              I18n.t('errors.payment_plan.plan_already_exist')
      end

      def payment_plan_values(vals)
        hash = {}
        vals.each do |key, val|
          new_key = key.underscore.to_sym
          hash[new_key] = val
        end

        hash
      end

      # Raises GraphQL execution error if land parcel does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_land_parcel_not_found_error(land_parcel)
        return if land_parcel

        raise GraphQL::ExecutionError, I18n.t('errors.land_parcel.not_found')
      end

      # Raises GraphQL execution error if user does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_user_not_found_error(user)
        return if user

        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found')
      end
    end
  end
end

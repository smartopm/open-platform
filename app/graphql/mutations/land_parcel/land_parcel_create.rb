# frozen_string_literal: true

module Mutations
  module LandParcel
    # Create a new Land Parcel
    class LandParcelCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :account_id, ID, required: false
      argument :parcel_number, String, required: true

      field :land_parcel, Types::LandParcelType, null: true

      def resolve(vals)
        land_parcel = if vals[:account_id].present?
                        create_land_parcel(vals)
                      else
                        create_account_land_parcel(vals)
                      end

        return { land_parcel: land_parcel } if land_parcel
      end

      def create_land_parcel(vals)
        account = context[:site_community].accounts.find_by(id: vals[:account_id])
        raise GraphQL::ExecutionError, 'Account not found' if account.nil?

        check_land_parcel(vals, account)
      end

      def create_account_land_parcel(vals)
        account = context[:site_community].accounts.create(user_id: vals[:user_id])
        check_land_parcel(vals, account) if account
      end

      def check_land_parcel(vals, account)
        check_number = context[:site_community].land_parcels.find_by(parcel_number: vals[:parcel_number])
        if check_number.nil?
          account.land_parcels.create!(community_id: context[:site_community].id, parcel_number: vals[:parcel_number])
        else
          t = check_number.land_parcel_accounts.create!(account_id: vals[:account_id])
        end
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

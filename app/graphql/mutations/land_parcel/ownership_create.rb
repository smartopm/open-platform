# frozen_string_literal: true

module Mutations
  module LandParcel
    # Create an owner for a Land Parcel
    class OwnershipCreate < BaseMutation
      argument :plot_id, ID, required: true
      argument :account_id, ID, required: false
      argument :user_id, ID, required: false
      argument :name, String, required: false
      argument :address, String, required: false

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        create_ownership

        return { success: true } if create_ownership
      end

      def create_ownership(vals)
        if vals[:account_id]
          account = context[:site_community].accounts.find_by(id: vals[:account_id])
          raise GraphQL::ExecutionError, 'Account not found' if account.nil?
        else
          account = context[:site_community].accounts.create!(user_id: vals[:user_id])
        end

        check_parcel = check_parcel_number(vals[:plot_id])
        check_parcel.land_parcel_accounts.create!(account_id: account)
      end

      def check_parcel_number(id)
        context[:site_community].land_parcels.find_by(id: id)
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

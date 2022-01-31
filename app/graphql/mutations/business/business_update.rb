# frozen_string_literal: true

module Mutations
  module Business
    # BusinessUpdate
    class BusinessUpdate < BaseMutation
      argument :id, ID, required: true
      argument :user_id, ID, required: true
      argument :name, String, required: true
      argument :email, String, required: true
      argument :phone_number, String, required: true
      argument :address, String, required: false
      argument :status, String, required: false
      argument :home_url, String, required: false
      argument :category, String, required: false
      argument :image_url, String, required: false
      argument :description, String, required: false
      argument :links, String, required: false
      argument :operation_hours, String, required: false

      field :business, Types::BusinessType, null: true

      def resolve(vals)
        business = context[:site_community].businesses.find_by(id: vals[:id])
        raise_business_not_found_error if business.nil?

        return { business: business } if business.update(vals)

        raise GraphQL::ExecutionError, business.errors.full_messages&.join(', ')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :business, permission: :can_update_business)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      def raise_business_not_found_error
        raise GraphQL::ExecutionError, I18n.t('errors.business.not_found')
      end
    end
  end
end

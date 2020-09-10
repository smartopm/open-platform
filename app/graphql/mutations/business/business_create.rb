# frozen_string_literal: true

module Mutations
  module Business
    # BusinessCreate
    class BusinessCreate < BaseMutation
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
        business = context[:site_community].businesses.new(vals)
        business.save!

        return { business: business } if business.persisted?

        raise GraphQL::ExecutionError, business.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

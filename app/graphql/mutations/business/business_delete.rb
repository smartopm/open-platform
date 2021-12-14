# frozen_string_literal: true

module Mutations
  module Business
    # BusinessDelete
    class BusinessDelete < BaseMutation
      argument :id, ID, required: true

      field :business_delete, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        business_delete = context[:site_community].businesses.find(id)&.update(status: 'deleted')

        return { business_delete: business_delete } if business_delete

        raise GraphQL::ExecutionError, business_delete.errors.full_message
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :business, permission: :can_delete_business)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

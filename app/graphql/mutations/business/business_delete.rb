module Mutations
  module Business
    class BusinessDelete < BaseMutation
      argument :id, ID, required: true

      field :business_delete, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        business_delete = context[:site_community].businesses.find(id)&.update(status: "deleted")
  
        return { business_delete: business_delete } if business_delete.persisted?
  
        raise GraphQL::ExecutionError, business_delete.errors.full_message
      end
  
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?
  
        true
      end
    end
  end
end
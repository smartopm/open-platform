# frozen_string_literal: true

module Mutations
  module User
    # Import users in bulk
    class Import < BaseMutation
      argument :csv_string, String, required: true
      argument :csv_file_name, String, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(csv_string:, csv_file_name:)
        UserImportJob.perform_later(csv_string, csv_file_name, context[:current_user])

        { success: true }
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

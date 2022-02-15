# frozen_string_literal: true

module Mutations
  module User
    # Import users in bulk
    class Import < BaseMutation
      argument :csv_string, String, required: true
      argument :csv_file_name, String, required: true
      argument :import_type, String, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(csv_string:, csv_file_name:, import_type:)
        if import_type.eql?('user')
          UserImportJob.perform_later(csv_string, csv_file_name, context[:current_user])
        else
          LeadImportJob.perform_later(csv_string, csv_file_name, context[:current_user])
        end

        { success: true }
      end

      def authorized?(_vals)
        return true if permitted?(module: :user, permission: :can_import_users)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

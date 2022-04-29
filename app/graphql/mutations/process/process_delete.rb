# frozen_string_literal: true

module Mutations
  module Process
    # Delete Process
    class ProcessDelete < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: false

      def resolve(id:)
        process = context[:site_community].processes.find_by(id: id)
        raise_error_message(I18n.t('errors.process.not_found')) if process.nil?

        return { success: true } if process.deleted!

        raise_error_message(process.errors.full_messages&.join(', '))
      end

      def authorized?(_vals)
        return true if permitted?(module: :process, permission: :can_delete_process_template)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

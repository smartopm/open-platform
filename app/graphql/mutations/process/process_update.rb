# frozen_string_literal: true

module Mutations
  module Process
    # Updates Process
    class ProcessUpdate < BaseMutation
      argument :id, ID, required: true
      argument :process_type, String, required: false
      argument :name, String, required: false

      field :process, Types::ProcessType, null: true

      def resolve(vals)
        process = Processes::Process.find_by(id: vals[:id])
        raise_error(I18n.t('errors.process.not_found')) if process.nil?

        return { process: process } if process.update(vals.except(:id))

        raise_error(process.errors.full_messages&.join(', '))
      end

      def authorized?(_vals)
        return true if permitted?(module: :process, permission: :can_update_process_template)

        raise_error(I18n.t('errors.unauthorized'))
      end

      def raise_error(error_message)
        raise GraphQL::ExecutionError, error_message
      end
    end
  end
end

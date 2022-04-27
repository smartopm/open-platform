# frozen_string_literal: true

module Mutations
  module Process
    # Updates Process
    class ProcessUpdate < BaseMutation
      argument :id, ID, required: true
      argument :process_type, String, required: false
      argument :name, String, required: false
      argument :form_id, ID, required: false
      argument :note_list_id, ID, required: false

      field :process, Types::ProcessType, null: true

      def resolve(vals)
        process = context[:site_community].processes.find_by(id: vals[:id])
        raise_error_message(I18n.t('errors.process.not_found')) if process.nil?

        return { process: process } if process.update(vals.except(:id, :note_list_id))

        raise_error_message(process.errors.full_messages&.join(', '))
      end

      def authorized?(_vals)
        return true if permitted?(module: :process, permission: :can_update_process_template)

        raise_error_message(I18n.t('errors.unauthorized'))
      end
    end
  end
end

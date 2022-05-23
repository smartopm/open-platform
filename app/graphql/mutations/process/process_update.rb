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

        note_list = Notes::NoteList.find_by(id: vals[:note_list_id])
        raise GraphQL::ExecutionError, I18n.t('errors.note_list.not_found') unless note_list

        update_process(vals, process, note_list)
      end

      def authorized?(_vals)
        return true if permitted?(module: :process, permission: :can_update_process_template)

        raise_error_message(I18n.t('errors.unauthorized'))
      end

      private

      def update_process(vals, process, note_list)
        ActiveRecord::Base.transaction do
          # Delink previous task list
          previous_task_list = process.note_list
          previous_task_list.update!(process_id: nil)
          # Link new task list
          process.reload
          note_list.update!(process_id: process.id)

          return { process: process } if process.update(vals.except(:id, :note_list_id))

          raise_error_message(process.errors.full_messages&.join(', '))
        end
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end
    end
  end
end

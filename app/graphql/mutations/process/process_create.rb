# frozen_string_literal: true

module Mutations
  module Process
    # Create Process
    class ProcessCreate < BaseMutation
      argument :name, String, required: true
      argument :form_id, ID, required: true
      argument :note_list_id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        note_list = Notes::NoteList.find_by(id: vals[:note_list_id])
        form = Forms::Form.find_by(id: vals[:form_id])

        raise GraphQL::ExecutionError, I18n.t('errors.note_list.not_found') unless note_list
        raise GraphQL::ExecutionError, I18n.t('errors.note_list.has_process') if note_list.process
        raise GraphQL::ExecutionError, I18n.t('errors.form.not_found') unless form

        ActiveRecord::Base.transaction do
          process_template = context[:site_community].processes.create!(
            vals.except(:note_list_id),
          )

          note_list.update!(process_id: process_template.id)

          { success: true }
        end
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def authorized?(_vals)
        return true if permitted?(module: :process,
                                  permission: :can_create_process_template)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

# frozen_string_literal: true

module Mutations
  module Note
    # bulk update notes
    class NoteBulkUpdate < BaseMutation
      argument :ids, [ID], required: true
      argument :completed, Boolean, required: false
      argument :query, String, required: false

      field :success, Boolean, null: true

      def resolve(vals)
        task_list = vals[:ids].presence || task_ids_list(vals[:query])
        raise GraphQL::ExecutionError, I18n.t('errors.note.task_not_found') if task_list.blank?

        tasks = context[:site_community].notes.where(id: task_list)
        return { success: true } if tasks.update(vals.except(:ids, :query))

        raise GraphQL::ExecutionError,
              I18n.t('errors.note.unable_to_update_tasks')
      end

      def task_ids_list(query)
        return [] if query.blank?

        notes = context[:site_community].notes.where(flagged: true)
        tasks = if query.present? && query.include?('assignees')
                  notes.search_assignee(query)
                elsif query.present? && query.include?('user')
                  notes.search_user(query)
                else
                  notes.search(query)
                end
        tasks.pluck(:id).uniq
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_bulk_assign_note)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

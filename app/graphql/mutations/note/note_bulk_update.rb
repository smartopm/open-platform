# frozen_string_literal: true

module Mutations
  module Note
    # bulk update notes
    class NoteBulkUpdate < BaseMutation
      argument :ids, [ID], required: true
      argument :completed, Boolean, required: false
      argument :due_date, String, required: false
      argument :query, String, required: false

      field :success, Boolean, null: true

      def resolve(vals)
        task_list = vals[:ids].presence || task_ids_list(vals[:query])
        tasks = context[:site_community].notes.where(id: task_list)

        return { success: true } if tasks.update(vals.except(:ids, :query))

        raise GraphQL::ExecutionError, 'Something went wrong while updating selected tasks'
      end

      def task_ids_list(query)
        # three types of searches
        # search => search_user => search_assignee
        tasks = if query.present? && query.include?('assignees')
                  context[:site_community].notes.search_assignee(query).where(flagged: true)
                elsif query.present? && query.include?('user')
                  context[:site_community].notes.search_assignee(query).where(flagged: true)
                else
                  context[:site_community].notes.search(query).where(flagged: true)
                end
        tasks.pluck(:id).uniq
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

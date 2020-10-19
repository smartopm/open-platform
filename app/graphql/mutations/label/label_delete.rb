# frozen_string_literal: true

module Mutations
  module Label
    # LabelDelete
    class LabelDelete < BaseMutation
      argument :id, ID, required: true

      field :label_delete, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        label_delete = check_label(id)
        raise GraphQL::ExecutionError, 'Label not found' if label_delete.nil?

        label_delete.user_labels.where(label_id: id).delete_all
        label_delete.campaign_labels.where(label_id: id).delete_all

        return { label_delete: label_delete } if label_delete.update(status: 'deleted')

        raise GraphQL::ExecutionError, label_delete.errors.full_message
      end

      def check_label(id)
        context[:site_community].labels.find_by(id: id)
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

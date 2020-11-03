# frozen_string_literal: true

module Mutations
  module Label
    # merge labels
    class LabelMerge < BaseMutation
      argument :label_id, ID, required: true
      argument :merge_label_id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(label_id:, merge_label_id:)
        raise GraphQL::ExecutionError, 'label ids cannot be the same' if label_id == merge_label_id

        label = label_id_check(label_id)
        merge_label = label_id_check(merge_label_id)
        raise GraphQL::ExecutionError, 'Label not found' if label.nil? || merge_label.nil?

        label.user_labels.each do |lab|
          merge_label.user_labels.create(user_id: lab[:user_id], label_id: lab[:label_id])
        rescue ActiveRecord::RecordNotUnique
          next
        end

        { success: true } if label
      end

      def label_id_check(id)
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

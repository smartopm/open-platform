# frozen_string_literal: true

module Mutations
  module Label
    # merge labels
    class LabelMerge < BaseMutation
      argument :label_id, ID, required: true
      argument :merge_label_id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(label_id:, merge_label_id:)
        raise_ids_can_not_be_same_error(label_id, merge_label_id)

        label = label_id_check(label_id)
        merge_label = label_id_check(merge_label_id)
        raise_label_not_found_error(label, merge_label)

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

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :label, permission: :can_merge_labels)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if label and merge label are same.
      #
      # @return [GraphQL::ExecutionError]
      def raise_ids_can_not_be_same_error(label_id, merge_label_id)
        return if label_id != merge_label_id

        raise GraphQL::ExecutionError, I18n.t('errors.label.ids_can_not_be_same')
      end

      # Raises GraphQL execution error if label or merge label does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_label_not_found_error(label, merge_label)
        return if label || merge_label

        raise GraphQL::ExecutionError, I18n.t('errors.label.not_found')
      end
    end
  end
end

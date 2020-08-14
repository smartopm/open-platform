# frozen_string_literal: true

module Mutations
  module Label
    # Create a new Label for the user
    class UserLabelCreate < BaseMutation
      argument :user_id, String, required: true
      argument :label_id, String, required: true

      field :label, [Types::UserLabelType], null: true

      # TODO: move create label operations to background job : Saurabh
      # rubocop:disable Metrics/AbcSize
      def resolve(user_id:, label_id:)
        user_ids = user_id.split(',')
        label_ids = label_id.split(',').map { |val| { label_id: val } }
        labels = []
        user_ids.each do |u_id|
          label_records = context[:current_user].find_a_user(u_id).user_labels.create!(label_ids)
          raise GraphQL::ExecutionError, label.errors.full_messages if label_records.nil?

          labels += label_records
        end
        { label: labels }
      end
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

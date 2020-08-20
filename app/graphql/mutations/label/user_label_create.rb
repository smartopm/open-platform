# frozen_string_literal: true

module Mutations
  module Label
    # Create a new Label for the user
    class UserLabelCreate < BaseMutation
      argument :user_id, String, required: true
      argument :label_id, String, required: true

      field :label, [Types::UserLabelType], null: true

      # TODO: move create label operations to background job : Saurabh
      def resolve(user_id:, label_id:)
        user_ids = user_id.split(',')
        label_ids = label_id.split(',')
        labels = []
        user_ids.each do |u_id|
          user = context[:current_user].find_a_user(u_id)
          label_records = create_user_label(user, label_ids)
          labels += label_records
        end
        { label: labels }
      end

      def create_user_label(user, label_ids)
        new_labels = label_ids - user.user_labels.pluck(:label_id)
        return [] if new_labels.empty?

        label_records = user.user_labels.create!(new_labels.map { |val| { label_id: val } })
        raise GraphQL::ExecutionError, label.errors.full_messages if label_records.nil?

        label_records
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

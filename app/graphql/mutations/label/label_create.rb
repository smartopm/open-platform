# frozen_string_literal: true

module Mutations
  module Label
    # Create a new Label
    class LabelCreate < BaseMutation
      argument :short_desc, String, required: true

      field :label, Types::LabelType, null: true

      def resolve(short_desc:)
        label = context[:current_user].community.labels.create!(short_desc: short_desc)

        return { label: label } if label.persisted?

        raise GraphQL::ExecutionError, label.errors.full_messages
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

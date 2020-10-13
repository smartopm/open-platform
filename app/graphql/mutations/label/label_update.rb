# frozen_string_literal: true

module Mutations
  module Label
    # Create a new Label
    class LabelUpdate < BaseMutation
      argument :id, ID, required: true
      argument :short_desc, String, required: true
      argument :description, String, required: false
      argument :color, String, required: true

      field :label, Types::LabelType, null: true

      def resolve(vals)
        label = context[:site_community].labels.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, 'Label not found' if label.nil?
        return { label: label } if label.update(vals)

        raise GraphQL::ExecutionError, label.errors.full_messages
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end

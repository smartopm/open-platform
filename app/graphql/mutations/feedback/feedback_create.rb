# frozen_string_literal: true

module Mutations
  module Feedback
    class FeedbackCreate < BaseMutation
      argument :is_thumbs_up, Boolean, required: true

      field :feedback, Types::FeedbackType, null: true

      def resolve(vals)
        feedback = ::Feedback.new(
          user_id: context[:current_user].id,
          created_at: DateTime.now,
          is_thumbs_up: vals[:is_thumbs_up],
        )
        feedback.save

        return { feedback: feedback } if feedback.persisted?

        raise GraphQL::ExecutionError, feedback.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end

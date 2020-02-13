# frozen_string_literal: true

module Mutations
  module Feedback
    class FeedbackCreate < BaseMutation
      argument :isThumbsUp, Boolean, required: false

      field :feedback, Types::FeedbackType, null: true

      def resolve(vals)
        feedback = context[:current_user].feedbacks.new(vals)
        feedback.user_id = context[:current_user].id
        feedback.created_at = DateTime.now
        feedback.is_thumbs_up = vals[:isThumbsUp]
        feedback.save

        return { feedback: feedback } if feedback.persisted?

        raise GraphQL::ExecutionError, feedback.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user?

        true
      end
    end
  end
end

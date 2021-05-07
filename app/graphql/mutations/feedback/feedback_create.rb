# frozen_string_literal: true

module Mutations
  module Feedback
    # Create feedback and update eventlogs
    class FeedbackCreate < BaseMutation
      argument :is_thumbs_up, Boolean, required: true
      argument :review, String, required: false

      field :feedback, Types::FeedbackType, null: true

      def resolve(vals)
        feedback = ::Feedback.new(
          user_id: context[:current_user].id,
          created_at: DateTime.now,
          is_thumbs_up: vals[:is_thumbs_up],
          review: vals[:review],
        )
        feedback.save
        log_feedback(vals[:is_thumbs_up])
        return { feedback: feedback } if feedback.persisted?

        raise GraphQL::ExecutionError, feedback.errors.full_messages
      end

      def log_feedback(feedback)
        user = ::User.find(context[:current_user].id)
        ::EventLog.create(acting_user_id: context[:current_user].id,
                          community_id: user.community_id, subject: 'user_feedback',
                          ref_id: user.id,
                          ref_type: 'User',
                          data: {
                            ref_name: user.name,
                            note: feedback ? 'thumbs up' : 'thumbs down',
                            type: user.user_type,
                          })
      end

      # TODO: Better auth here
      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

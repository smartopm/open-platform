# frozen_string_literal: true

module Mutations
  module ActivityLog
    # Add an activity log for a user
    class Add < BaseMutation
      argument :user_id, ID, required: true
      argument :note, String, required: false

      field :id, ID, null: false
      field :created_at, String, null: false
      field :note, String, null: true

      def resolve(user_id:, note: nil)
        user = ::User.find(user_id)
        raise GraphQL::ExecutionError, 'User not found' unless user

        act_log = user.activity_logs.new(reporting_user_id: context[:current_user].id,
                                         note: note)

        return act_log if act_log.save

        raise GraphQL::ExecutionError, act_log.errors.full_messages
      end
    end
  end
end

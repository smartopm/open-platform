# frozen_string_literal: true

module Mutations
  module ActivityLog
    # Add an activity log for a user
    class Add < BaseMutation
      argument :member_id, ID, required: true
      argument :note, String, required: false

      field :id, ID, null: false
      field :created_at, String, null: false
      field :note, String, null: true

      def resolve(member_id:, note: nil, acting_member_id:)
        member = Member.find(member_id)
        raise GraphQL::ExecutionError, 'Member not found' unless member

        act_log = member.activity_logs.new(reporting_member_id: acting_member_id,
                                           note: note)

        return act_log if act_log.save

        raise GraphQL::ExecutionError, act_log.errors.full_messages
      end
    end
  end
end

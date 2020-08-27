# frozen_string_literal: true

module Mutations
    module User
      # merge users
      class Merge < BaseMutation
        argument :id, ID, required: true
        argument :duplicate_id, ID, required: true
  
        field :success, Boolean, null: true
  
        def resolve(id:, duplicate_id:)
          user = context[:site_community].users.find(id)
          raise GraphQL::ExecutionError, 'NotFound' unless user
   
          return { success: true } if user.merge_user(duplicate_id)
  
          raise GraphQL::ExecutionError, user.errors.full_messages
        end
  
        def authorized?(vals)
          user_record = context[:site_community].users.find(vals[:id])
          current_user = context[:current_user]
          raise GraphQL::ExecutionError, 'Unauthorized' unless user_record.community_id ==
                                                               current_user.community_id
  
          true
        end
      end
    end
  end
  
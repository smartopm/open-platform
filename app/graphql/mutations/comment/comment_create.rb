# frozen_string_literal: true

module Mutations
    module Comment
      # Create a new Comment
      class CommentCreate < BaseMutation
        argument :user_id, ID, required: true
        argument :post_id, ID, required: true
        argument :comment, String, required: true
  
        field :comment, Types::CommentType, null: true
  
        def resolve(vals)
          comment = context[:current_user].community.comments.new
          comment.post_id = vals[:post_id]
          comment.user_id = vals[:user_id]
          comment.comment = vals[:comment]
          comment.save!

          return { comment: comment } if comment.persisted?
  
          raise GraphQL::ExecutionError, comment.errors.full_messages
        end
  

        def authorized?(_vals)
          current_user = context[:current_user]
          raise GraphQL::ExecutionError, 'Unauthorized' unless current_user
  
          true
        end
      end
    end
  end
  
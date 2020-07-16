# frozen_string_literal: true

# label queries
module Types::Queries::Label
  extend ActiveSupport::Concern

  included do
    # Get label entries
    field :labels, [Types::LabelType], null: true do
      description 'Get all labels'
    end

    # Get label for the user, using the user id
    field :user_labels, [Types::LabelType], null: true do
      description 'Get label by its owner id'
      argument :user_id, GraphQL::Types::ID, required: true
    end

    # Get users with a label_id
    field :label_users, [Types::UserType], null: true do
      description 'Get users by the label id'
      argument :label_id, GraphQL::Types::ID, required: true
    end
  end

  def labels
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:current_user].community.labels
  end

  def user_labels(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:current_user].find_a_user(user_id).labels
  end

  def label_users(label_id:)
    context[:current_user].find_label_users(label_id)
  end
end

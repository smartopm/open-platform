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

    # Get users with a label_ids
    field :label_users, [Types::UserType], null: true do
      description 'Get users by the label ids, this should be a comma separated string'
      argument :labels, String, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def labels
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].labels
  end

  def user_labels(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].users.find(user_id)&.labels&.all
  end

  def label_users(labels:, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

    context[:site_community].users
                            .find(context[:current_user].id)&.find_label_users(labels)&.limit(limit)
                            .offset(offset)
  end
end

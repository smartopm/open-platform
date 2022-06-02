# frozen_string_literal: true

# label queries
module Types::Queries::Label
  extend ActiveSupport::Concern

  included do
    # Get label entries
    field :labels, [Types::LabelType], null: true do
      description 'Get all labels'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
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
    end
  end

  def labels(offset: 0, limit: 50)
    unless permitted?(module: :label, permission: :can_fetch_all_labels)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    Labels::Label.with_users_count(context[:site_community].id, limit, offset)
  end

  def user_labels(user_id:)
    unless permitted?(module: :label, permission: :can_fetch_user_labels) ||
           context[:current_user]&.id == user_id
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    user = verify_user(user_id)
    user.labels
  end

  def label_users(labels:)
    unless permitted?(module: :label, permission: :can_fetch_label_users)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].users.find(context[:current_user].id)&.find_label_users(labels)&.all
  end

  private

  def verify_user(user_id)
    user = Users::User.allowed_users(context[:current_user]).find_by(id: user_id)
    return user if user.present?

    raise GraphQL::ExecutionError, I18n.t('errors.user.does_not_exist')
  end
end

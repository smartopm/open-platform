# frozen_string_literal: true

# form queries
module Types::Queries::Form
  extend ActiveSupport::Concern

  included do
    # Get form entries
    field :forms, [Types::FormType], null: true do
      description 'Get all forms'
    end

    # Get form, using the form id
    field :form, Types::FormType, null: true do
      description 'Get form by its id'
      argument :id, GraphQL::Types::ID, required: true
    end
    # Get form properties
    field :form_properties, [Types::FormPropertiesType], null: true do
      description 'Get form properties by form id'
      argument :form_id, GraphQL::Types::ID, required: true
    end
    # Get form status for user
    field :form_user, Types::FormUsersType, null: true do
      description 'Get user form by form id and user id'
      argument :form_id, GraphQL::Types::ID, required: true
      argument :user_id, GraphQL::Types::ID, required: true
    end
    # Get form properties with values for user
    field :form_user_properties, [Types::UserFormPropertiesType], null: true do
      description 'Get user form properties by form id and user id'
      argument :form_id, GraphQL::Types::ID, required: true
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  def forms
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].forms
  end

  def form(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].forms.find(id)
  end

  def form_properties(form_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].forms.find(form_id).form_properties
  end

  def form_user(form_id:, user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         context[:current_user]&.id.eql?(user_id)

    FormUser.find_by(form_id: form_id, user_id: user_id)
  end

  # rubocop:disable Metrics/AbcSize
  def form_user_properties(form_id:, user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin? ||
                                                         context[:current_user]&.id.eql?(user_id)

    context[:site_community].forms.find(form_id).form_users.find_by(user_id: user_id)
                            .user_form_properties.eager_load(:form_property).with_attached_image
  end
  # rubocop:enable Metrics/AbcSize
end

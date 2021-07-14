# frozen_string_literal: true

# form queries
module Types::Queries::Form
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
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

    field :form_entries, Types::FormEntriesType, null: true do
      description 'Get user forms for a particular form'
      argument :form_id, GraphQL::Types::ID, required: true
      argument :query, String, required: false
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    # Get form properties with values for user
    field :form_user_properties, [Types::UserFormPropertiesType], null: true do
      description 'Get user form properties by form id and user id'
      argument :form_id, GraphQL::Types::ID, required: true
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end
  # rubocop:enable Metrics/BlockLength
  def forms
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    context[:site_community].forms.order(created_at: :desc)
  end

  def form(id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    context[:site_community].forms.find(id)
  end

  def form_properties(form_id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    context[:site_community].forms.find(form_id).form_properties
  end

  def form_user(form_id:, user_id:)
    unless context[:current_user]&.admin? || context[:current_user]&.id.eql?(user_id)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    Forms::FormUser.find_by(form_id: form_id, user_id: user_id)
  end

  # Returns all forms users associated with the form
  #
  # @param form_id [String] Form#id
  #
  # @return [Hash]
  def form_entries(form_id:, query: nil, limit: 20, offset: 0)
    raise_unauthorized_error

    form = context[:site_community].forms.find_by(id: form_id)
    raise_form_not_found_error(form)

    query = updated_query(query)
    form_users = form.form_users.includes(:user).search(query).order(created_at: :desc)
                     .limit(limit).offset(offset)
    { form_name: form.name, form_users: form_users }
  end

  # rubocop:disable Metrics/AbcSize
  def form_user_properties(form_id:, user_id:)
    unless context[:current_user]&.admin? || context[:current_user]&.id.eql?(user_id)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].forms.find(form_id).form_users.find_by(user_id: user_id)
                            .user_form_properties.eager_load(:form_property).with_attached_image
  end
  # rubocop:enable Metrics/AbcSize

  private

  # Raises GraphQL execution error if user is unauthorized.
  #
  # @return [GraphQL::ExecutionError]
  def raise_unauthorized_error
    return if context[:current_user]&.admin?

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end

  # Raises GraphQL execution error if user is not an admin
  #
  # @param [Forms::Form]
  #
  # @return [GraphQL::ExecutionError]
  def raise_form_not_found_error(form)
    return if form.present?

    raise GraphQL::ExecutionError, I18n.t('errors.form.not_found')
  end

  # Returns query by concatinating status and created at
  #
  # @param query [String]
  #
  # @return [String]
  def updated_query(query)
    return query if query.blank?

    date = begin
      Date.parse(query)
    rescue StandardError
      nil
    end
    return "created_at:#{date}" if date.present?

    status = Forms::FormUser.statuses[query]
    query += " OR status:#{status}" if status.present?
    query
  end
end

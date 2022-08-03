# frozen_string_literal: true

# form queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::Form
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  included do
    # Get form entries
    field :forms, [Types::FormType], null: true do
      description 'Get all forms'
      # this optional argument, will be passed when an admin is loading a user profile
      # to submit forms on users behalf
      argument :user_id, GraphQL::Types::ID, required: false
    end

    # Get form, using the form id
    field :form, Types::FormType, null: true do
      description 'Get form by its id'
      argument :id, GraphQL::Types::ID, required: true
    end
    # Get form properties
    field :form_properties, [Types::FormPropertiesType], null: true do
      description 'Get form properties by form id'
      argument :form_id, GraphQL::Types::ID, required: false
    end
    # Get form property
    field :form_property, Types::FormPropertiesType, null: true do
      description 'Get a form property by form id and form property id'
      argument :form_id, GraphQL::Types::ID, required: true
      argument :form_property_id, GraphQL::Types::ID, required: true
    end
    # Get form status for user
    field :form_user, Types::FormUsersType, null: true do
      description 'Get user form by form user id'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :form_user_id, GraphQL::Types::ID, required: true
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
      description 'Get user form properties by form user id'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :form_user_id, GraphQL::Types::ID, required: true
    end

    # Get form properties with values for user
    field :form_submissions, [Types::FormSubmissionType], null: true do
      description 'Get user form properties by form user id'
      argument :start_date, String, required: true
      argument :end_date, String, required: true
    end

    field :form_categories, [Types::CategoryType], null: true do
      description 'Get all categories of a form'
      argument :form_id, GraphQL::Types::ID, required: true
    end

    field :submitted_forms, [Types::FormUsersType], null: true do
      description 'Get all form submissions for user'
      argument :user_id, GraphQL::Types::ID, required: true
    end

    field :form_comments, [Types::NoteCommentType], null: true do
      description 'return comments for one task'
      argument :form_user_id, GraphQL::Types::ID, required: true
    end
  end
  # rubocop:enable Metrics/BlockLength

  def forms(user_id: nil)
    user = if !user_id.nil?
             find_user_by_id(user_id)
           else
             context[:current_user]
           end
    unless permitted?(module: :forms, permission: :can_access_forms)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].forms.not_deprecated.by_published(user)
                            .by_role(user.user_type).order(created_at: :desc)
  end

  def form(id:)
    unless permitted?(module: :forms, permission: :can_fetch_form)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].forms.find(id)
  end

  def form_properties(form_id:)
    unless permitted?(module: :forms, permission: :can_fetch_form_properties)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].forms.find(form_id).form_properties
  end

  def form_property(form_id:, form_property_id:)
    unless permitted?(module: :forms, permission: :can_fetch_form_property)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].forms.find(form_id).form_properties.find_by(id: form_property_id)
  end

  def form_user(user_id:, form_user_id:)
    unless permitted?(module: :forms, permission: :can_view_form_user) ||
           context[:current_user]&.id.eql?(user_id)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    Forms::FormUser.find_by(id: form_user_id)
  end

  # Returns all forms users associated with the form
  #
  # @param form_id [String] Form#id
  #
  # @return [Hash]
  # rubocop:disable Metrics/AbcSize
  def form_entries(form_id:, query: nil, limit: 20, offset: 0)
    raise_unauthorized_error

    form = context[:site_community].forms.find_by(id: form_id)
    raise_form_not_found_error(form)

    query = updated_query(query)
    form_users = Forms::FormUser.where(form_id: Forms::Form.where(grouping_id: form.grouping_id)
                                .select(:id))
                                .search(query)
                                .limit(limit).offset(offset)
    { form_name: form.name, form_users: form_users }
  end

  # rubocop:disable Metrics/MethodLength
  def form_user_properties(user_id:, form_user_id:)
    unless form_permissions_check? || context[:current_user]&.id.eql?(user_id)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    Forms::FormUser.find_by(id: form_user_id).user_form_properties
  end

  def form_submissions(start_date:, end_date:)
    unless permitted?(module: :forms, permission: :can_view_form_form_submissions)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    submissions = []
    form_name = 'Customs Registry'
    last_version = context[:site_community].forms.where('name ILIKE ?', "#{form_name}%")
                                           .order(version_number: :desc).first
    raise_form_not_found_error(last_version)

    context[:site_community].forms.where(grouping_id: last_version.grouping_id)
                            .eager_load(form_users: { user_form_properties: [:form_property] })
                            .where(form_users: { created_at: start_date..end_date }).each do |form|
      form.form_users.each do |form_user|
        form_user.user_form_properties.each do |property|
          prop = { value: property.value, field_name: property.form_property.field_name,
                   field_type: property.form_property.field_type, id: SecureRandom.uuid,
                   order: property.form_property.order }
          submissions << prop
        end
      end
    end
    submissions
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  # Returns all categories associated with the form
  #
  # @param form_id [String] Form#id
  #
  # @return [Array<Forms::Category>]
  def form_categories(form_id:)
    unless permitted?(module: :forms, permission: :can_fetch_form_categories)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    form = Forms::Form.find_by(id: form_id)
    raise_form_not_found_error(form)

    form.categories.order(:order)
  end

  # Returns all form submissions for current user
  #
  # @return [Array<Forms::FormUsers>]
  def submitted_forms(user_id:)
    validate_authorization(:my_forms, :can_access_own_forms)

    user = context[:site_community].users.find(user_id)
    user.form_users.order(created_at: :desc)
  end

  def form_comments(form_user_id:)
    validate_authorization(:my_forms, :can_fetch_form_task_comments)

    Forms::FormUser.find(form_user_id).comments.order(created_at: :desc)
  end

  private

  # Raises GraphQL execution error if user is unauthorized.
  #
  # @return [GraphQL::ExecutionError]
  def raise_unauthorized_error
    return true if permitted?(module: :forms, permission: :can_view_form_entries)

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

  def find_user_by_id(user_id)
    user = Users::User.find_by(id: user_id)
    return user if user.present?

    raise GraphQL::ExecutionError, I18n.t('errors.user.not_found_with_id', user_id: user_id)
  end

  def form_permissions_check?
    permitted?(module: :forms, permission: :can_view_form_user_properties)
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
# rubocop:enable Metrics/ModuleLength

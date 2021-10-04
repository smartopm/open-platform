# frozen_string_literal: true

# community queries
module Types::Queries::Permission
  extend ActiveSupport::Concern
  VALID_ROLES = Users::User.new.valid_roles
  VALID_MODULES = %w[user note payment payment_plan post action_flow activity_log business
                     campaign comment community contact_info discussion email_template
                     entry_request].freeze
  included do
    # get permissions for specific module and user type
    field :permissions, [String, { null: true }], null: true do
      argument :module, String, required: true
      argument :role, String, required: true
    end
  end

  def permissions(**params)
    unless context[:current_user]
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end
    validate_params(params)
    ::Policy::ApplicationPolicy
      .new.permission_list[params[:module].to_sym][params[:role].to_sym][:permissions]
  end

  def validate_params(query_params)
    return if VALID_ROLES.include?(query_params[:role]) &&
              VALID_MODULES.include?(query_params[:module])

    raise GraphQL::ExecutionError, I18n.t('permission.bad_query')
  end
end

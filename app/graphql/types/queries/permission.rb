# frozen_string_literal: true

# community queries
module Types::Queries::Permission
  extend ActiveSupport::Concern
  VALID_ROLES = Users::User::VALID_USER_TYPES
  VALID_MODULES = %w[user note plan_payment payment_plan post action_flow activity_log business
                     campaign comment community contact_info discussion email_template
                     entry_request feedback form invoice label land_parcel login
                     message settings showroom subscription_plan substatus_log
                     temparature timesheet transaction upload user].freeze
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
    raise GraphQL::ExecutionError, I18n.t('permission.bad_query') unless valid_params?(params)

    ::Policy::ApplicationPolicy
      .new.permission_list.dig(params[:role].to_sym, params[:module].to_sym, :permissions)
  end

  def valid_params?(query_params)
    VALID_ROLES.include?(query_params[:role]) && VALID_MODULES.include?(query_params[:module])
  end
end

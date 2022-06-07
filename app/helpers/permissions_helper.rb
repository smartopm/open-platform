# frozen_string_literal: true

# PermissionsHelper,
# accessed by ::PermissionsHelper
module PermissionsHelper
  def validate_authorization(module_name, permission)
    return if permitted?(module: module_name, permission: permission)

    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
  end

  def permitted?(**args)
    is_admin = args[:admin]
    ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      admin: is_admin,
      module: args[:module],
      permission: args[:permission],
    )
  end
end

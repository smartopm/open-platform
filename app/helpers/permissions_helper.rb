# frozen_string_literal: true

# PermissionsHelper,
# accessed by ::PermissionsHelper
module PermissionsHelper
  def allowed?(**args)
    is_admin = args[:admin] # other cases could be false and nil 
    ::Policy::ApplicationPolicy.new(
      context[:current_user], nil
    ).permission?(
      admin: is_admin,
      module: args[:module],
      permission: args[:permission],
    )
  end
end

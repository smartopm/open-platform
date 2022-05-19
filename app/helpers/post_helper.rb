# frozen_string_literal: true

# Helper Module
module PostHelper
  def user_authorized?(vals)
    return can_set_accessibility? if vals[:accessibility].present?

    post = context[:site_community].posts.find(vals[:id])
    return if post.accessibility.eql?('admins')

    post.user_id == context[:current_user].id
  end

  def can_set_accessibility?
    permitted?(module: :discussion, permission: :can_set_accessibility)
  end
end

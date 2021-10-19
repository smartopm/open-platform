# frozen_string_literal: true

# ApplicationPolicy,
# accessed by ::Policy::ApplicationPolicy from other modules
require 'yaml'
module Policy
  # class ApplicationPolicy
  class ApplicationPolicy
    attr_reader :user, :record, :permission_list

    PERMISSIONS = YAML.load_file("#{::Rails.root}/app/policies/permissions.yml")

    # Food for thought, think of a resource.
    # only the owner can update in the future.
    # We can capture the curent user and curent record and return true or false
    def initialize(user = nil, record = nil)
      @user = user
      @record = record
      @permission_list = PERMISSIONS.deep_transform_keys!(&:to_sym)
    end

    def permission?(**args)
      return false if user.nil?

      current_module = args[:module]
      user_permissions = permission_list.dig(user.user_type.to_sym, current_module, :permissions)
      return false if user_permissions.nil?

      user_permissions.include?(args[:permission].to_s)
    end
  end
end

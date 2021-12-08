# frozen_string_literal: true

require 'yaml'
namespace :db do
  desc 'Add permissions to role based on yml file'
  task add_permissions_to_global_roles: :environment do
    permissions = YAML.load_file("#{::Rails.root}/app/policies/permissions.yml")
    permission_list = permissions.deep_transform_keys!(&:to_sym)
    valid_modules = %w[action_flow activity_log].freeze

    available_roles.each do |role|
      valid_modules.each do |valid_module|
        role_permissions = permission_list.dig(role.name.to_sym,
                                               valid_module.to_sym, :permissions)
        next unless role_permissions

        permission = Permission.find_by(role: role, module: valid_module)
        if permission
          Permission.update(role: role, module: valid_module, permissions: role_permissions)
        else
          Permission.create(role: role, module: valid_module, permissions: role_permissions)
        end
      end
      puts 'A role processed'
    end
    puts 'Successfully added permissions to current global roles'
  end
end

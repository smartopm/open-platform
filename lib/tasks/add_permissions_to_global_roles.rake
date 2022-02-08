# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
require 'yaml'
namespace :db do
  desc 'Add permissions to role based on yml file'
  task add_permissions_to_global_roles: :environment do
    ActiveRecord::Base.transaction do
      permissions = YAML.load_file("#{::Rails.root}/app/policies/permissions.yml")
      permission_list = permissions.deep_transform_keys!(&:to_sym)
      valid_modules = %w[gate_access user dashboard profile guest_list
                         discussion entry_request logout note].freeze
      Role.where(community_id: nil).find_each do |role|
        puts "Adding/updating permissions for #{role.name}"
        valid_modules.each do |valid_module|
          role_permissions = permission_list.dig(role.name.to_sym,
                                                 valid_module.to_sym, :permissions)
          next unless role_permissions

          permission = Permission.find_by(role: role, module: valid_module)
          if permission
            permission.update!(permissions: role_permissions)
            puts "Updated permissions for #{valid_module}"
          else
            Permission.create!(role: role, module: valid_module, permissions: role_permissions)
            puts "Created permissions for #{valid_module}"
          end
        end
        puts "Finished adding/updating permissions for #{role.name}"
      end
      puts 'Successfully added permissions to current global roles'
    end
  rescue StandardError => e
    puts 'Failed to add permissions'
    puts e.message.to_s
  end
end
# rubocop:enable Metrics/BlockLength

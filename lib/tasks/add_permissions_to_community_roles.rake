# frozen_string_literal: true

require 'yaml'

namespace :db do
  desc 'Add permissions to role based on community_permissions.yml file'
  task add_permissions_to_community_roles: :environment do
    ActiveRecord::Base.transaction do
      valid_community_names = ['Nkwashi', 'Ciudad Morazán', 'DoubleGDP', 'Tilisi',
                               'DAST', 'Enyimba']
      community_hash = {}
      Community.find_each do |community|
        name = community.name
        community_hash[name] = community.id
      end

      permissions = YAML.load_file("#{::Rails.root}/app/policies/community_permissions.yml")
      permission_list = permissions.deep_transform_keys!(&:to_s)
      valid_modules = %w[user note plan_payment payment_plan post action_flow activity_log business
                         campaign comment community contact_info discussion email_template
                         entry_request feedback forms invoice label land_parcel login
                         message settings showroom subscription_plan substatus_log
                         temparature timesheet transaction upload user gate_access dashboard
                         guest_list profile logout communication community_settings sos
                         event_log process lead lead_log].freeze
      communities = permission_list.keys
      communities.each do |community_name|
        next unless valid_community_names.include? community_name

        community_permissions = permission_list[community_name]
        next unless community_permissions

        community_roles = community_permissions.keys
        community_roles.each do |community_role|
          role = Role.find_by(name: community_role,
                              community_id: community_hash[community_name]) ||
                 Role.create!(name: community_role,
                              community_id: community_hash[community_name])
          role_modules = community_permissions[role.name].keys
          role_modules.each do |role_module|
            next unless valid_modules.include?(role_module)

            role_permissions = community_permissions.dig(role.name, role_module, 'permissions')
            next unless role_permissions

            permission = Permission.find_by(role: role, module: role_module)
            if permission
              permission.update!(permissions: role_permissions)
            else
              Permission.create!(role: role, module: role_module, permissions: role_permissions)
            end
          end
        end
      end
      puts 'Successfully added permissions to specified roles and communities'
    end
  rescue StandardError => e
    puts 'Failed to add permissions to specified roles and communities'
    puts e.message.to_s
  end
end

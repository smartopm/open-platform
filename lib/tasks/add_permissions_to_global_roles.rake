# frozen_string_literal: true

require 'yaml'
namespace :db do
  desc 'Add permissions to role based on yml file'
  task add_permissions_to_global_roles: :environment do
    ActiveRecord::Base.transaction do
      permissions = YAML.load_file("#{::Rails.root}/app/policies/permissions.yml")
      permission_list = permissions.deep_transform_keys!(&:to_sym)
      valid_modules = %w[user note plan_payment payment_plan post action_flow activity_log business
                         campaign comment community contact_info discussion email_template
                         entry_request feedback forms invoice label land_parcel login
                         message settings showroom subscription_plan substatus_log
                         temparature timesheet transaction upload user gate_access dashboard
                         guest_list profile logout communication community_settings sos
                         event_log process lead lead_log].freeze
      Role.where(community_id: nil).find_each do |role|
        puts "Adding/updating permissions for #{role.name}"
        valid_modules.each do |valid_module|
          role_permissions = permission_list.dig(role.name.to_sym,
                                                 valid_module.to_sym, :permissions)
          role_permissions = [] if role_permissions.blank?

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

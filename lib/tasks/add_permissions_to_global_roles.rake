# frozen_string_literal: true

require 'yaml'
# rubocop:disable Metrics/BlockLength
namespace :db do
  desc 'Add permissions to role based on yml file'
  task add_permissions_to_global_roles: :environment do
    ActiveRecord::Base.transaction do
      permissions = YAML.load_file("#{::Rails.root}/app/policies/permissions.yml")
      permission_list = permissions.deep_transform_keys!(&:to_sym)
      available_roles = Role.where(community_id: nil)
      valid_modules = %w[user note plan_payment payment_plan post action_flow activity_log business
                         campaign comment community contact_info discussion email_template
                         entry_request feedback form invoice label land_parcel login
                         message settings showroom subscription_plan substatus_log
                         temparature timesheet transaction upload user gate_access
                         guest_list profile logout communication community_settings sos].freeze

      available_roles.each do |role|
        valid_modules.each do |valid_module|
          role_permissions = permission_list.dig(role.name.to_sym,
                                                 valid_module.to_sym, :permissions)
          if role_permissions
            Permission.create(role: role, module: valid_module, permissions: role_permissions)
          end
        end
      end
      puts 'Successfully added permissions to current roles'
    end
  rescue StandardError => e
    puts 'Failed to add permissions to current roles'
    puts e.message.to_s
  end
end
# rubocop:enable Metrics/BlockLength

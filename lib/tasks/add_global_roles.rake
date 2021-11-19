# frozen_string_literal: true

namespace :db do
  desc 'Create global roles'
  task add_global_roles: :environment do
    ActiveRecord::Base.transaction do
      global_roles = %w[security_guard admin resident
                        contractorvprospective_client
                        client visitor custodian site_worker]
      global_roles.each do |name|
        role = Role.where(name: name).first_or_initialize
        next if role.persisted?

        role.save!
      end
      puts 'Created application global roles'
    end
  rescue StandardError => e
    puts 'Failed to create global roles'
    puts e.message.to_s
  end
end

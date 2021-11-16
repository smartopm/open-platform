namespace :db do
    desc 'Create global roles'
    task add_global_roles: :environment do
      ActiveRecord::Base.transaction do
        global_roles = %w[security_guard admin resident contractor
            prospective_client client visitor custodian site_worker]
        global_roles.each do |name|
            Role.create(name: name)
        end
        puts "Created application global roles"
      end
    rescue StandardError => e
      puts 'Failed to create global roles'
      puts e.message.to_s
    end
  end
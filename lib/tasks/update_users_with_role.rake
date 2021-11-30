# frozen_string_literal: true

namespace :db do
  desc 'Add role to user based on existing user type'
  task update_users_with_role: :environment do
    roles_hash = {}
    Role.find_each do |role|
      name = role.name
      roles_hash[name] = role.id
    end
    Users::User.where(role_id: nil).find_each do |user|
      next if user.role_id.present?

      user.update!(role_id: roles_hash[user.user_type])
      puts "Updated user: #{user.id}"
    end
    puts 'A thousand records updated'
    puts 'Updated user types to roles'
  end
rescue StandardError => e
  puts 'Failed to update user types to roles'
  puts e.message.to_s
end

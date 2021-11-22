# frozen_string_literal: true

namespace :db do
  desc 'Add role to user based on existing user type'
  task add_role_to_users: :environment do
    ActiveRecord::Base.transaction do
      roles_hash = {}
      Role.find_each do |role|
        name = role.name
        roles_hash[name] = role.id
      end
      Users::User.find_in_batches do |users|
        users.each do |user|
          user.update(role_id: roles_hash[user.user_type])
        end
      end
      puts 'Updated user types to roles'
    end
  rescue StandardError => e
    puts 'Failed to update user types to roles'
    puts e.message.to_s
  end
end

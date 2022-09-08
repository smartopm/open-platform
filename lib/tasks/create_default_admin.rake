# frozen_string_literal: true

namespace :db do
  desc 'Create a default admin'
  task :create_default_admin, %i[email username password] => :environment do |_t, args|
    abort('Username and password are required') unless args.username && args.password

    community = Community.first
    abort("Can't find a community") unless community

    ActiveRecord::Base.transaction do
      user = community.users.create!(
        name: args.username,
        email: args.email,
        user_type: 'admin',
        state: 'valid',
        role: Role.create!(name: 'admin'),
      )

      user.update!(username: args.username, password: args.password)
    end
  end
end

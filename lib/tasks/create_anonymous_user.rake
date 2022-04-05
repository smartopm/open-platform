# frozen_string_literal: true

namespace :db do
  desc 'Create an anonymous user for each community'
  task create_anonymous_user: :environment do
    Community.find_each do |community|
      # create an anonymous user permission
      # make sure this anonymous user can submit forms
      community.users.create!(name: 'Public Submission', user_type: 'public_user',
                              role: Role.find_by(name: 'public_user'))
    end
  end
end

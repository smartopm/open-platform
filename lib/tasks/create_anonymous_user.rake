# frozen_string_literal: true

namespace :db do
  desc 'Create an anonymous user for each community'
  task create_anonymous_user: :environment do
      Community.find_each do |community|
        # create an anonymouse user permission
        # make sure this anonymouse user can submit forms
        # 
        community.users.create!(name: 'anonymous', user_type: 'anonymous', role: community.roles.find_by(name: 'visitor'))
      end
  end
end

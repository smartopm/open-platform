# frozen_string_literal: true

require 'deploy.rb'

namespace :deploy do
  desc 'Create Gitlab tag to push to production'
  task push_to_prod: :environment do
    Deploy.create_tag!
  end
end

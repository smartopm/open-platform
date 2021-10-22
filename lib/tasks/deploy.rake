# frozen_string_literal: true

namespace :deploy do
  desc 'Start auto deploy'
  task :create_tag, %i[gitlab_token] => :environment do |_t, args|
    DeployJob.perform_now(args.gitlab_token)
  end
end

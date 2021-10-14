# frozen_string_literal: true

namespace :deploy do
  desc 'Start auto deploy'
  task create_tag: :environment do
    DeployJob.perform_now
  end
end

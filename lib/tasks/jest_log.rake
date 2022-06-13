# frozen_string_literal: true

require 'jest_log'

namespace :jest_log do
  desc 'Check count of log issues'
  task :get_issue_count, %i[job_id gitlab_token] => :environment do |_t, args|
    JestLog.fetch_job_log(args[:job_id], args[:gitlab_token])
  end
end

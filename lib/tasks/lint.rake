# frozen_string_literal: true

namespace :lint do
  desc 'lint the project'
  task check: :environment do
    sh 'bundle exec rubocop'
  end
  desc 'lint and autofix the project'
  task fix: :environment do
    sh 'bundle exec rubocop -a'
  end
end

task lint: :environment do
  Rake::Task['lint:check'].invoke
end

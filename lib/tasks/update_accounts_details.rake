# frozen_string_literal: true

desc "update accounts details to their associated user's name"
task update_accounts_details: :environment do
  puts 'updating accounts details ....'
  User.all.joins(:accounts).distinct.each(&:update_associated_accounts_details)
end

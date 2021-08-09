# frozen_string_literal: true

namespace :db do
  desc 'Add general land parcel and payment plan'
  task add_general_land_parcel_and_payment_plan: :environment do
    ActiveRecord::Base.transaction do
      Users::User.all.each do |user|
        user.send :create_general_land_parcel_and_payment_plan
      end
    end
  rescue StandardError => e
    puts 'Failed to create land parcel and payment plan'
    puts e.message.to_s
  end
end

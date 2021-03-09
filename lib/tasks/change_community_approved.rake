# frozen_string_literal: true

desc 'change construction approved sub status to building permit approved'
task update_sub_status: :environment do
  puts 'updating substatus'
  comm = Community.find_by(name: 'Nkwashi')
  puts "Found #{comm.name}, updating notes with this community_id #{comm.id}"

  # rubocop:disable Rails/SkipsModelValidations
  User.update_all(sub: comm.id)
  # rubocop:enable Rails/SkipsModelValidations
end
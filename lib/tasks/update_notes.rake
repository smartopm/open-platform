# frozen_string_literal: true

desc 'update all notes with community_id'
task update_community_notes: :environment do
  puts 'updating notes'
  comm = Community.find_by(name: 'Nkwashi')
  puts "Found #{comm.name}, updating notes with this community_id #{comm.id}"

  # rubocop:disable Rails/SkipsModelValidations
  Note.update_all(community_id: comm.id)
  # rubocop:enable Rails/SkipsModelValidations
end

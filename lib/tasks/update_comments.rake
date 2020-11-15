# frozen_string_literal: true

desc 'update all comments with community_id'
task update_community_comments: :environment do
  puts 'updating comments'
  comm = Community.find_by(name: 'Nkwashi')
  puts "Found #{comm.name}, updating notes with this community_id #{comm.id}"

  # rubocop:disable Rails/SkipsModelValidations
  Comment.update_all(community_id: comm.id)
  # rubocop:enable Rails/SkipsModelValidations
end

# frozen_string_literal: true

namespace :db do
  desc 'Add description to report an issue task'
  task update_tasks_completed_at: :environment do
    puts 'Starting updating tasks ...'
    ActiveRecord::Base.transaction do
      Notes::Note.where(completed: true, completed_at: nil).find_each do |note|
        date = note.versions.select do |version|
                 version&.object&.include?('completed: false')
               end.last&.created_at
        note.completed_at = date.eql?(nil) ? note.updated_at : date
        note.save!
      end
    end
    puts 'Updated tasks ...'
  rescue StandardError => e
    puts 'Failed to update completed_at for task'
    puts e.message.to_s
  end
end

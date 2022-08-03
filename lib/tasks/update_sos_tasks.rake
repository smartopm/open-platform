# frozen_string_literal: true

namespace :db do
  desc 'Update completed status of SOS tasks'
  task update_sos_tasks: :environment do
    ActiveRecord::Base.transaction do
      sos_tasks = Notes::Note.where(flagged: true, description: 'Emergency SOS',
                                    category: 'emergency', completed: nil)
      tasks_count = sos_tasks.count
      sos_tasks.find_each do |task|
        task.update(completed: false)
      end
      puts "Updated #{tasks_count} tasks"
    end
  rescue StandardError => e
    puts 'Failed to update task'
    puts e.message.to_s
  end
end

# frozen_string_literal: true

# rubocop:disable Rails/SkipsModelValidations
namespace :tasks do
  desc 'cleanup open tasks'
  task :clean_open_tasks, [:community_name] => :environment do |_t, args|
    community = Community.find_by(name: args.community_name)
    open_task_ids = community.notes.where(flagged: true).by_completion(false).pluck(:id)
    unassigned_task_ids = open_task_ids - Notes::AssigneeNote.where(note_id: open_task_ids)
                                                             .pluck(:note_id)

    puts 'Closing all open unassigned tasks...'
    Notes::Note.where(id: unassigned_task_ids).update_all(completed: true)

    puts 'Closing remaining open tasks from 2020...'
    community.notes.where(flagged: true).by_completion(false)
             .where('created_at >= ? and created_at <= ?', '2020-01-01', '2020-12-31').update_all(
               completed: true,
             )

    puts 'Done.'
  end
end
# rubocop:enable Rails/SkipsModelValidations

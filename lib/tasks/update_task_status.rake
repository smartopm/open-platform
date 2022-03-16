# frozen_string_literal: true

# rubocop:disable Rails/SkipsModelValidations
namespace :backfill do
  desc 'Update task status fields'
  task :update_task_status, %i[community_name] => :environment do |_t, args|
    abort('Community Name required') unless args.community_name

    community = Community.find_by(name: args.community_name)
    abort('Community not found') unless community
    puts "#{'*' * 20}Starting tasks update for #{community.name}#{'*' * 20}"

    drc_tasks_count = 0
    non_drc_task_count = 0

    drc_form_users = community.drc_form_users
    drc_tasks = community.notes.where(form_user_id: drc_form_users)
    non_drc_tasks = community.notes
                             .where.not(id: drc_tasks.pluck(:id))
                             .where.not(category: 'template')

    puts "Updating DRC tasks#{'.' * 20}"
    drc_tasks.find_each do |task|
      task.update_column(:status, :completed) if task.completed
      drc_tasks_count += 1
    end
    puts "Updated #{drc_tasks_count} DRC tasks#{'.' * 10}"

    puts "Updating non DRC tasks#{'.' * 20}"
    non_drc_tasks.find_each do |task|
      if task.completed
        task.update_column(:status, :completed)
        non_drc_task_count += 1
        next
      end

      task.update_column(:status, :in_progress)
      non_drc_task_count += 1
    end
    puts "Updated #{non_drc_task_count} non DRC tasks#{'.' * 20}"

    puts "#{'*' * 20}Finished updating tasks for #{community.name}#{'*' * 20}"
  end
end
# rubocop:enable Rails/SkipsModelValidations

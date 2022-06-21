# frozen_string_literal: true

desc 'Update message tasks body'
task :update_message_tasks_body, %i[community_name] => :environment do |_t, args|
  abort('Community Name required') unless args.community_name

  community = Community.find_by(name: args.community_name)
  abort('Community not found') unless community

  puts "Updating message tasks for #{community.name}.................................."
  message_tasks = community.notes.where(category: 'message')
  puts "Found #{message_tasks.size} tasks"

  updated_tasks = 0

  message_tasks.find_each do |task|
    message_path = URI.extract(task.body)[0]
    next if message_path.blank?

    updated_tasks += 1
    task.update!(body: 'Reply to message')

  rescue StandardError => e
    puts "#{e} -- skipping"
    next
  end
  puts "Updated task body for #{updated_tasks} tasks"
  puts "Done updating message tasks for #{community.name}.................................."
end

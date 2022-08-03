# frozen_string_literal: true

desc 'Update DRC tasks body'
task :update_drc_tasks_body, %i[community_name] => :environment do |_t, args|
  abort('Community Name required') unless args.community_name

  community = Community.find_by(name: args.community_name)
  abort('Community not found') unless community

  puts "Updating tasks for #{community.name}.................................."
  form_tasks = community.notes.where(category: 'form')

  count = 0
  drc_tasks_count = 0
  skipped = []

  form_tasks.find_each do |task|
    form = task&.form_user&.form

    if form.blank?
      # Form tasks created before form_user_id was added
      puts "Task id missing form user: #{task.id}"
      begin
        form_name = task.body.split("\n").last.split('</a>')[0].strip
        task.update!(body: form_name)
        next
      rescue StandardError
        skipped << task.id
        next
      end
    end

    if form.drc_form?
      developer_name_field = form.form_properties.find_by(field_name: 'Project Developer')
      developer_name_value = task.form_user.user_form_properties.find_by(
        form_property_id: developer_name_field&.id,
      )&.value

      task.update!(body: developer_name_value || form.name)
      drc_tasks_count += 1
    else
      task.update!(body: form.name)
    end
    count += 1
  end
  puts "Updated form tasks for #{community.name}. Total: #{count}\t DRC: #{drc_tasks_count}"
  puts 'Done updating form tasks....................'
  puts "Skipped tasks: #{skipped.size} \n#{skipped}"
end

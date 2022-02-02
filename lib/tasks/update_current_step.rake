# frozen_string_literal: true

desc 'update processes with first step'
task :update_current_step, %i[community_name] => :environment do |_t, args|
  abort('Community Name required') unless args.community_name

  community = Community.find_by(name: args.community_name)
  abort('Community not found') unless community

  puts 'updating tasks ..................................'
  drc_form_name = 'DRC Project Review Process'
  drc_form = community.forms.where('name ILIKE ?', "#{drc_form_name}%").first
  drc_ids = community.forms.where(grouping_id: drc_form.grouping_id).pluck(:id)

  abort('DRC Form not found') unless drc_form

  drc_form_users = Forms::FormUser.where(form_id: drc_ids).pluck(:id)

  drc_tasks = community.notes.where(form_user_id: drc_form_users)

  drc_tasks.find_each do |task|
    task.update_parent_current_step if task.parent_note_id
  end
  puts 'done updating tasks .............'
end

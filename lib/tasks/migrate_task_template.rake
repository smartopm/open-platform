# frozen_string_literal: true

desc 'Migrate Task Template to new community'
task :migrate_task_template, %i[community_name] => :environment do |_t, args|
  abort('Destination community name required') if args.community_name.blank?

  destination_community = Community.find_by(name: args.community_name)
  abort('Destination community not found') if destination_community.blank?

  community = Community.find_by(name: 'DoubleGDP')
  templates = community.notes
                       .where(category: 'template', parent_note_id: nil)
                       .includes(:sub_notes)

  ActiveRecord::Base.transaction do
    templates.each do |t|
      t.update!(community_id: destination_community.id)
      t.sub_tasks.each do |sub_task|
        sub_task.update!(community_id: destination_community.id)
      end
    end

    form = community.forms.find_by(name: 'DRC Project Review Process')
    form.update!(community_id: destination_community.id) if form.present?

    puts "Migrated templates & form to #{destination_community.name} community"
  end
end

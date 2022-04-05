# frozen_string_literal: true

desc 'Update Exising DRC Processes & Task List'
task :migrate_drc_process_note_lists, %i[community_name] => :environment do |_t, args|
  def create_drc_note_list!(community, new_drc_process)
    puts 'Creating New NoteList For community'

    ActiveRecord::Base.transaction do
      new_note_list = community.note_lists
                               .create!(
                                 name: 'DRC Task List',
                                 process_id: new_drc_process.id,
                               )

      puts 'Done!! DRC NoteList created'
      new_note_list
    end
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Rails/SkipsModelValidations
  def add_drc_steps_to_note_list(community, note_list_id)
    puts 'Add DRC Steps to NoteList'

    ActiveRecord::Base.transaction do
      templates = community.notes
                           .where(
                             category: 'template',
                             parent_note_id: nil,
                           )

      templates.each do |template|
        template.update_column(:note_list_id, note_list_id)

        template_steps = community.notes.unscoped
                                  .where(
                                    category: 'template',
                                    parent_note_id: template[:id],
                                  )
                                  .order(created_at: :asc)

        next unless template_steps.size.positive?

        template_steps.each do |template_step|
          template_step.update_column(:note_list_id, note_list_id)
        end
      end

      puts 'Done!! Add DRC Steps to NoteList'
    end
  end
  # rubocop:enable Rails/SkipsModelValidations
  # rubocop:enable Metrics/MethodLength

  def create_drc_process!(community)
    puts 'Creating New DRC Process For community'

    ActiveRecord::Base.transaction do
      new_process = community.processes
                             .create!(
                               name: 'DRC',
                               process_type: 'drc',
                             )

      puts 'Done!! DRC Process created'
      new_process
    end
  end

  # rubocop:disable Rails/SkipsModelValidations
  def add_drc_proccess_to_drc_form(community, new_drc_process)
    puts 'Add DRC Process to Form'
    community.processes.find_by(id: new_drc_process.id)
             .update_column(:form_id, drc_form_id(community))
  end
  # rubocop:enable Rails/SkipsModelValidations

  def drc_form_id(community)
    form_name = 'DRC Project Review Process'
    first_version = community.forms.find_by(name: form_name)
    latest_version = community.forms.where('name ILIKE ?', "#{form_name}%")
                              .order(version_number: :desc).first

    return latest_version.id if first_version.id == latest_version.grouping_id
  end

  abort('Invalid Arguments') if args.community_name.blank?

  # Migrate per community basis
  community = Community.find_by(name: args.community_name)
  abort('Community is undefined') if community.blank?

  ActiveRecord::Base.transaction do
    new_drc_process = create_drc_process!(community)

    new_drc_note_list = create_drc_note_list!(community, new_drc_process)

    add_drc_steps_to_note_list(community, new_drc_note_list.id)

    add_drc_proccess_to_drc_form(community, new_drc_process)
  end
end

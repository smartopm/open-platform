# frozen_string_literal: true

# rubocop:disable  Metrics/AbcSize
desc 'Order Existing DRC Tasks'
task :order_drc_tasks, %i[community_name category] => :environment do |_t, args|
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Rails/SkipsModelValidations
  def update_drc_templates(community)
    puts 'Updating DRC Templates'

    ActiveRecord::Base.transaction do
      templates = community.notes
                           .where(
                             category: 'template',
                             parent_note_id: nil,
                           )

      templates.each_with_index do |template, count|
        puts "Parent Template: updating #{template[:body]} => order: #{count + 1}"
        template.update_column(:order, count + 1)

        template_steps = community.notes.unscoped
                                  .where(
                                    category: 'template',
                                    parent_note_id: template[:id],
                                  )
                                  .order(created_at: :asc)

        next unless template_steps.size.positive?

        template_steps.each_with_index do |template_step, step_order|
          puts "Template Sub Step: updating #{template_step[:body]} => order: #{step_order + 1}"
          template_step.update_column(:order, step_order + 1)
        end
      end

      puts 'Done!! DRC Templates Updated'
    end
  end
  # rubocop:enable Rails/SkipsModelValidations
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Rails/SkipsModelValidations
  def update_drc_tasks(community)
    puts 'Updating General DRC Tasks'

    ActiveRecord::Base.transaction do
      drc_form_ids = community.drc_form_users.pluck(:id)

      drc_projects = community.notes
                              .where(parent_note_id: nil, form_user_id: drc_form_ids)

      drc_projects.each do |project|
        puts "Traversing Project - #{project[:body]}"
        next unless project.sub_tasks.size.positive?

        first_level_steps = community.notes.where(parent_note_id: project[:id])

        # order the first_level_steps
        first_level_steps.each_with_index do |first_step, index|
          puts "1st Level:: Updating #{first_step[:body]} -> order #{index + 1}"
          first_step.update_column(:order, index + 1)

          next unless first_step.sub_tasks.size.positive?

          second_level_steps = community.notes
                                        .where(parent_note_id: first_step[:id])
                                        .order(created_at: :asc)

          second_level_steps.each_with_index do |second_step, count|
            puts "2nd Level:: Updating #{second_step[:body]} -> order: #{count + 1}"
            second_step.update_column(:order, count + 1)
          end
        end
      end

      puts 'DRC Tasks Updated'
    end
  end
  # rubocop:enable Rails/SkipsModelValidations
  # rubocop:enable Metrics/MethodLength

  abort('Invalid Arguments') if args.community_name.blank? || args.category.blank?

  # Migrate per community basis
  community = Community.find_by(name: args.community_name)
  abort('Community is undefined') if community.blank?

  task_category =  args.category

  update_drc_templates(community) if task_category == 'templates'

  # Non-template DRC Tasks
  update_drc_tasks(community) if task_category == 'drc_tasks'
end
# rubocop:enable Metrics/AbcSize

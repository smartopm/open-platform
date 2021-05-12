# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
namespace :import do
  desc 'Migrate System Emails'
  task :migrate_email_templates, %i[community_name] => :environment do |_t, args|
    abort('Community Name required') unless args.community_name

    community = Community.find_by(name: args.community_name)
    abort('Community not found') unless community

    system_email_templates = [
      {
        name: 'welcome_template',
        subject: 'Welcome Template',
      },
      {
        name: 'task_reminder_template',
        subject: 'Task Reminder',
      },
    ]

    ActiveRecord::Base.transaction do
      system_email_templates.each do |t|
        template = community.email_templates.find_by(name: t[:name])
        if template.present?
          puts "skipping template with name #{t[:name]}. already exists"
          next
        end

        community.email_templates.create!(
          community: community,
          tag: 'system',
          name: t[:name],
          subject: t[:subject],
        )
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength

# frozen_string_literal: true

namespace :import do
  desc 'Migrate System Emails'
  task :migrate_email_templates, %i[community_name] => :environment do |_t, args|
    abort('Community Name required') unless args.community_name

    community = Community.find_by(name: args.community_name)
    abort('Community not found') unless community

    system_email_templates = [
      {
        name: 'welcome',
        subject: "Welcome To #{community.name}",
      },
      {
        name: 'task_reminder_template',
        subject: 'Task Reminder',
      },
      {
        name: 'post_alert_template',
        subject: 'The Tag you follow has a new post',
      },
      {
        name: 'notification_template',
        subject: 'Notification',
      },
      {
        name: 'campaign_template',
        subject: "Greetings from #{community.name}!!!",
      },
      {
        name: 'user_import',
        subject: 'Your Import Status',
      },
      {
        name: 'form_submit_template',
        subject: 'A new form submission has been done',
      },
      {
        name: 'form_update_submit_template',
        subject: 'A form submission has been updated',
      },
      {
        name: 'one_time_login_template',
        subject: 'One Time Login',
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
          name: t[:name],
          subject: t[:subject],
          body: '',
          tag: 'system',
        )
      end
    end

    puts "Done Successfully. #{system_email_templates.size} migrated"
  end
end

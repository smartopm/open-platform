# frozen_string_literal: true

namespace :db do
  desc 'Creates welcome email templates'
  task create_welcome_email_templates: :environment do
    Community.find_each do |community|
      template = community.email_templates.find_by(name: 'Generic Template')
      next if template.nil?

      community.email_templates
               .find_or_create_by(name: 'Welcome Email Template')
               .update(template.attributes.except('id', 'name')
               .merge(tag: 'system',
                      subject: I18n.t('email_template.welcome_email.subject',
                                      community_name: community.name)))
    end
    puts 'Created welcome email templates'
  end
end

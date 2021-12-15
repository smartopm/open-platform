# frozen_string_literal: true

# rubocop:disable Rails/SkipsModelValidations

namespace :db do
  desc 'Add description to report an issue task'
  task add_description_to_report_an_issue_task: :environment do
    ActiveRecord::Base.transaction do
      Notes::Note.where('( body ILIKE ? OR body ILIKE ?) AND description IS ?', '%Report an Issue%',
                        '%Informar de un problema%', nil).find_each do |note|
        form_user_id = note.body&.split('user_form/')&.last&.split('/task')&.first&.split('/')&.last
        form_user = Forms::FormUser.find_by(id: form_user_id)
        next if form_user.nil?

        form_property = form_user.form.form_properties.find_by(field_name: 'Description')
        description = form_user.user_form_properties.find_by(form_property_id: form_property&.id)

        note.update_columns(description: description&.value)
      end
      puts 'Added description for tasks'
    end
  rescue StandardError => e
    puts 'Failed to add description to report an issue task'
    puts e.message.to_s
  end
end
# rubocop:enable Rails/SkipsModelValidations

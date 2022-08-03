# frozen_string_literal: true

desc 'update all form names'
task update_form_names: :environment do
  puts 'updating forms'
  Forms::Form.deprecated.find_each do |form|
    puts "updating #{form.name} to #{form.name} - #{I18n.t('deprecated')}"
    form.update!(name: "#{form.name} - #{I18n.t('deprecated')}")
  end
end

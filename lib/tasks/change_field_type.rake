# frozen_string_literal: true

desc 'change image field to file upload'
task change_field_type: :environment do
  puts 'changing image field type to file upload'

  # rubocop:disable Rails/SkipsModelValidations
  Forms::FormProperty.where(field_type: 'image').update_all(field_type: 'file_upload')
  # rubocop:enable Rails/SkipsModelValidations
end

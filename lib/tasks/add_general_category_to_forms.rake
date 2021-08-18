# frozen_string_literal: true

namespace :db do
  desc 'Add general category to forms'
  task add_general_category_to_forms: :environment do
    ActiveRecord::Base.transaction do
      # rubocop:disable Rails/SkipsModelValidations
      Forms::Form.all.each do |form|
        category = form.categories.create(field_name: 'General Category', order: 1,
                                          header_visible: false, general: true)
        form.form_properties.update_all(category_id: category.id)
      end
      # rubocop:enable Rails/SkipsModelValidations
    end
  rescue StandardError => e
    puts 'Failed to add general category'
    puts e.message.to_s
  end
end

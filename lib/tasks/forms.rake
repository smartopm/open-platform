# frozen_string_literal: true

namespace :forms do
  desc 'Add grouping-id to forms'
  task add_grouping_id: :environment do
    Forms::Form.find_each do |f|
      f.update!(grouping_id: f.id)
    end

    puts 'Done.'
  end
end

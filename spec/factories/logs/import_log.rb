# frozen_string_literal: true

FactoryBot.define do
  factory :import_log, class: 'Logs::ImportLog' do
    community
  end
end

# frozen_string_literal: true

FactoryBot.define do
  factory :time_sheet, class: 'Users::TimeSheet' do
    user
  end
end

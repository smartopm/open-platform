# frozen_string_literal: true

FactoryBot.define do
  sequence :process_name do |n|
    "Process #{n}"
  end

  factory :process, class: 'Processes::Process' do
    name  { generate(:process_name) }
    community
    form
  end
end

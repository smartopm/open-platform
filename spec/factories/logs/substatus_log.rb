# frozen_string_literal: true

FactoryBot.define do
  factory :substatus_log, class: 'Logs::SubstatusLog' do
    user
    community
    previous_status { 'plots_fully_purchased' }
    new_status { 'eligible_to_start_construction' }
  end
end

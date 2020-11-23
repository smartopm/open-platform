# frozen_string_literal: true

FactoryBot.define do
  factory :action_flow do
    sequence :title do |n|
      "Flow #{n}"
    end
    description { 'Just a flow' }
    event_condition { '{"==":[1,1]}' }
    event_action do
      { action_name: 'Email', action_fields: {
        email: { name: 'email', value: 'email@gmail.com', type: 'string' },
      } }
    end
    community
  end
end

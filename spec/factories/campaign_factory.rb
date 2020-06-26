# frozen_string_literal: true

FactoryBot.define do
  sequence :campaign_name do |n|
    "Campaign #{n}"
  end

  factory :campaign do
    name { generate(:campaign_name) }
    message { "Testing campaigns" }
    batch_time { Time.now }
    user_id_list { '23fsafsafa1147,2609adf61sfsdfs871fd147' }
  end
end

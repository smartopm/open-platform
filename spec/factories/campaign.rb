# frozen_string_literal: true

FactoryBot.define do
  sequence :campaign_name do |n|
    "Campaign #{n}"
  end

  factory :campaign do
    name { generate(:campaign_name) }
    message { 'Visiting' }
    batch_time { Time.zone.now }
    user_id_list { '23fsafsafa1147,2609adf61sfsdfs871fd147' }
    campaign_type { %w[sms email].sample }
    status { 'draft' }
  end
end

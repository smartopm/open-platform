# frozen_string_literal: true

FactoryBot.define do
  factory :campaign_label, class: 'Labels::CampaignLabel' do
    label
    campaign
  end
end

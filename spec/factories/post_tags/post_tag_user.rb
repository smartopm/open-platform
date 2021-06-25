# frozen_string_literal: true

FactoryBot.define do
  factory :post_tag_user, class: 'PostTags::PostTagUser' do
    post_tag
    user
  end
end

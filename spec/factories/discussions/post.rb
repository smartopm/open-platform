# frozen_string_literal: true

FactoryBot.define do
  factory :post, class: 'Discussions::Post' do
    community
    user
    discussion
    content { 'New Post' }
    status { 'active' }
    accessibility { 'everyone' }
  end
end

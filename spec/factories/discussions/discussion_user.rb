# frozen_string_literal: true

FactoryBot.define do
  factory :discussion_user, class: 'Discussions::DiscussionUser' do
    user
    discussion
  end
end

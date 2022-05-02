# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Discussions::Discussion, type: :model do
  let!(:current_user) { create(:user_with_community) }
  let!(:community) { create(:community) }

  describe 'community discussions' do
    it 'should allow to create discussions for the community' do
      current_user.community.discussions.create(
        title: 'Welcome to discussions',
        description: 'This post is to welcome all our users to discussions',
        post_id: '17',
      )
      expect(current_user.community.discussions.length).to eql 1
      expect(current_user.community.discussions[0].community_id).to eql current_user.community_id
      expect(current_user.community.discussions[0].description).to include 'users to discussions'
      expect(current_user.community.discussions[0].title).to eql 'Welcome to discussions'
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:comments).class_name('Comments::Comment') }
    it { is_expected.to have_many(:discussion_users) }
    it { is_expected.to have_many(:posts) }
    it { is_expected.to have_many(:users).through(:discussion_users) }
  end
end

# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PostTags::PostTag, type: :model do
  let!(:current_user) { create(:user_with_community) }
  let!(:community) { create(:community) }

  describe 'community postags from wordpress' do
    it 'should allow to create post_tags for the community' do
      current_user.community.post_tags.create(
        name: 'Welcome here',
        slug: 'welcome_here',
      )
      expect(current_user.community.post_tags.length).to eql 1
      expect(current_user.community.post_tags[0].community_id).to eql current_user.community_id
      expect(current_user.community.post_tags[0].slug).to include 'welcome_here'
      expect(current_user.community.post_tags[0].name).to eql 'Welcome here'
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:post_tag_users).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:post_tag_users) }
  end
end

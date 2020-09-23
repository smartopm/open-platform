# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Comment, type: :model do
  let!(:current_user) { create(:user_with_community) }
  # create a discussion for the user community
  let!(:user_discussion) do
    create(:discussion, user_id: current_user.id, post_id: '20')
  end

  describe 'community comments' do
    it 'should allow to create comments for the community' do
      current_user.comments.create(content: 'This is a comment', discussion_id: user_discussion.id)
      expect(current_user.comments.length).to eql 1
      expect(current_user.comments[0].user_id).to eql current_user.id
      expect(current_user.comments[0].discussion_id).to eql user_discussion.id
      expect(current_user.comments[0].content).to eql 'This is a comment'
    end
  end
  describe 'community discussions' do
    it 'should check for discussions for the community' do
      expect(user_discussion.id).not_to be_nil
      expect(user_discussion.user_id).to eql current_user.id
      expect(user_discussion.title).to include 'Community Discussion'
      expect(user_discussion.post_id).to eql '20'
    end
  end
  describe 'associations' do
    it { is_expected.to belong_to(:note).optional }
    it { is_expected.to belong_to(:discussion).optional }
    it { is_expected.to belong_to(:user) }
  end
end

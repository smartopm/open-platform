# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Discussions::Post, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:content).of_type(:text) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:discussion) }
    it { is_expected.to belong_to(:community) }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:status).with_values(active: 0, deleted: 1) }
  end

  describe 'scopes' do
    let!(:community) { create(:community) }
    let!(:user) do
      create(:user, community_id: community.id, email: 'john@doublegdp.com',
                    phone_number: '9988776655')
    end
    let(:discussion) { create(:discussion, community: community, user_id: user.id) }
    let!(:post) { create(:post, community: community, discussion: discussion, user: user) }

    describe 'by_accessibility' do
      context 'everyone' do
        it 'returns posts accessible to everyone' do
          posts = discussion.posts.by_accessibility(user.user_type)
          expect(posts.count).to eql 1
        end
      end

      context 'admins' do
        before { post.update(accessibility: 'admins') }
        it 'returns posts accessible to admins only' do
          posts = discussion.posts.by_accessibility(user.user_type)
          expect(posts.count).to eql 0
        end
      end
    end
  end
end

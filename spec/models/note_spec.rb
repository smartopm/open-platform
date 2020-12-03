# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Note, type: :model do
  describe 'note crud' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:admin_note) do
      admin.notes.create(
        body: 'This is a note',
        user_id: current_user.id,
        community_id: current_user.community_id,
      )
    end

    it 'should let an admin create a note for a user' do
      current_user.notes.create(author_id: admin.id, body: 'Test Note')
      expect(current_user.notes.length).to eql 1
    end
    it 'should create a note for a user with accepted categories' do
      current_user.notes.create(author_id: admin.id, body: 'Test Note', category: 'email')
      expect(current_user.notes.length).to eql 1
    end
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:author_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:assigned_to).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:category).of_type(:string) }
    it { is_expected.to have_db_column(:description).of_type(:text) }
    it { is_expected.to have_db_column(:body).of_type(:text) }
    it { is_expected.to have_db_column(:flagged).of_type(:boolean) }
    it { is_expected.to have_db_column(:completed).of_type(:boolean) }
    it { is_expected.to have_db_column(:due_date).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:assignee_notes) }
    it { is_expected.to have_many(:assignees) }
    it { is_expected.to have_many(:note_comments) }
    it { is_expected.to have_many(:note_histories) }
  end

  describe 'search scope' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:admin_note) do
      admin.notes.create(
        body: 'This is a note',
        user_id: current_user.id,
        community_id: current_user.community_id,
      )
    end

    it 'should allow search by user' do
      notes = described_class.search_user("user: #{admin.name}")
      expect(notes).not_to be_nil
    end
    it 'should allow search by assignees' do
      notes = described_class.search_assignee("assignees = #{admin.name}")
      expect(notes).not_to be_nil
    end
  end
end

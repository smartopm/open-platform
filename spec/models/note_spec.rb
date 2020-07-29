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

    it 'should assign or unassign a note from a user' do
      admin_note.assign_or_unassign_user(current_user.id)
      expect(current_user.assignee_notes.length).to eql 1
      # unassign
      # admin_note.assign_or_unassign_user(current_user.id)
      # expect(current_user.assignee_notes.length).to eql 0
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:assignee_notes) }
    it { is_expected.to have_many(:assignees) }
  end
end

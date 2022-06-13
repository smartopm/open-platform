# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Comments::NoteComment, type: :model do
  describe 'note comment crud' do
    let!(:current_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:note) do
      admin.notes.create!(
        body: 'This is a note',
        user_id: current_user.id,
        community_id: current_user.community_id,
        author_id: admin.id,
      )
    end
    let(:note_comment) { create(:note_comment, note: note, user: current_user) }

    it 'should create a comment on a note' do
      current_user.note_comments.create!(note_id: note.id, body: 'Test Comment', status: 'active')
      expect(note.note_comments.length).to eql 1
      expect(note.note_comments.pluck(:body)).to include 'Test Comment'
    end

    it 'should update a comment on a note' do
      note_comment.update!(body: 'Comment Body')
      expect(note_comment.body).to eql 'Comment Body'
    end
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:note_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:body).of_type(:text) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it do
      is_expected.to have_db_column(:tagged_documents).of_type(:string)
                                                      .with_options(default: [], array: true)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:note).class_name('Notes::Note') }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:reply_from).class_name('Users::User').optional }
  end
end

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
    let!(:form) { create(:form, community: admin.community) }
    let!(:form_user) { create(:form_user, form: form, user: admin, status_updated_by: admin) }

    it 'should create a comment on a note' do
      current_user.note_comments.create!(note_id: note.id, body: 'Test Comment', status: 'active')
      expect(note.note_comments.length).to eql 1
      expect(note.note_comments.pluck(:body)).to include 'Test Comment'
    end

    it 'should update a comment on a note' do
      note_comment.update!(body: 'Comment Body')
      expect(note_comment.body).to eql 'Comment Body'
    end

    context '#formatted_body' do
      it 'truncates note comment body to 5 words' do
        note_comment = current_user.note_comments.create!(
          note_id: note.id,
          body: 'word1 word2 word3 word4 word5 word6',
          status: 'active',
        )

        expect(note_comment.formatted_body).to eq('word1 word2 word3 word4 word5...')
      end

      it 'substitutes attached documents with direct link for process comments' do
        create(:process, form_id: form.id, process_type: 'drc', name: 'DRC')
        note.update!(form_user_id: form_user.id)

        note_comment = current_user.note_comments.create!(
          note_id: note.id, body: 'See attached ###__123__image.png__###',
          status: 'active',
          tagged_documents: [123]
        )

        expect(note_comment.formatted_body).to include('<a href')
        expect(note_comment.formatted_body).to include('&document_id=123')
        expect(note_comment.formatted_body).to include('image.png')
      end

      it 'does not substitute with no attached documents' do
        create(:process, form_id: form.id, process_type: 'drc', name: 'DRC')
        note.update!(form_user_id: form_user.id)

        note_comment = current_user.note_comments.create!(
          note_id: note.id, body: 'process comment no attachment',
          status: 'active',
          tagged_documents: []
        )

        expect(note_comment.formatted_body).not_to include('<a href')
        expect(note_comment.formatted_body).not_to include('&document_id=123')
        expect(note_comment.formatted_body).not_to include('image.png')
        expect(note_comment.formatted_body).to include('process comment no attachment')
      end

      it 'does not substitute when not associated to a process' do
        note.update!(form_user_id: form_user.id)

        note_comment = current_user.note_comments.create!(
          note_id: note.id, body: 'regular form task with attachment',
          status: 'active',
          tagged_documents: [123]
        )

        expect(note_comment.formatted_body).not_to include('<a href')
        expect(note_comment.formatted_body).not_to include('&document_id=123')
        expect(note_comment.formatted_body).not_to include('image.png')
        expect(note_comment.formatted_body).to include('regular form task with attachment')
      end
    end
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:note_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:body).of_type(:text) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:send_to_resident).of_type(:boolean) }
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

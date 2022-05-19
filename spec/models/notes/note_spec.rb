# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Notes::Note, type: :model do
  let(:current_user) { create(:user_with_community) }
  let(:admin) { create(:admin_user, community_id: current_user.community_id) }
  let(:admin_note) do
    create(:note,
           body: 'This is a note',
           user_id: current_user.id,
           author_id: admin.id,
           community_id: current_user.community_id)
  end
  let(:user_note) do
    create(:note,
           body: 'This is another note',
           user_id: current_user.id,
           author_id: admin.id,
           parent_note_id: admin_note.id,
           community_id: current_user.community_id)
  end

  describe 'note crud' do
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
    it { is_expected.to have_db_column(:parent_note_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:author).class_name('Users::User') }
    it { is_expected.to belong_to(:form_user).class_name('Forms::FormUser').optional }
    it { is_expected.to have_many(:assignee_notes).dependent(:destroy) }
    it { is_expected.to have_many(:assignees).through(:assignee_notes).source(:user) }
    it do
      is_expected
        .to have_many(:note_comments)
        .class_name('Comments::NoteComment')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:note_histories).dependent(:destroy) }
    it { is_expected.to have_many(:sub_notes).class_name('Notes::Note').dependent(:destroy) }
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status)
        .with_values(not_started: 0, in_progress: 1, needs_attention: 2, at_risk: 3, completed: 4)
    end
  end

  describe 'sub_notes' do
    before do
      @sub_note = admin.notes.create!(
        body: 'This is a sub note',
        user_id: current_user.id,
        community_id: current_user.community_id,
        parent_note_id: admin_note.id,
        author_id: admin.id,
      )
    end

    it 'creates a sub_note' do
      expect(@sub_note.parent_note).to eq(admin_note)
    end

    it 'creates uses `sub_task` alias' do
      expect { admin_note.sub_tasks }.not_to raise_error
      expect(admin_note.sub_tasks).to eq(admin_note.sub_notes)
    end

    it 'updates parent note after an update' do
      user_note.update!(completed: true)
      expect(admin_note.saved_changes?).to eq true
    end
    it { is_expected.to callback(:update_parent_current_step).after(:save) }
  end

  describe 'attachments' do
    it 'accepts file attachments' do
      admin_note.documents.attach(
        io: File.open(Rails.root.join('spec/support/test_image.png')),
        filename: 'test_image.png',
      )

      expect(admin_note.documents.all.size).to eql(1)
    end
  end

  describe 'search scope' do
    it 'should allow search by user' do
      notes = described_class.search_user("user: #{admin.name}")
      expect(notes).not_to be_nil
    end
    it 'should allow search by assignees' do
      notes = described_class.search_assignee("assignees = #{admin.name}")
      expect(notes).not_to be_nil
    end
  end

  describe 'after update' do
    it 'creates an event log' do
      expect(admin_note).to receive(:log_update_event)
      admin_note.update!(body: 'A new body')
    end
  end

  describe 'before_save' do
    describe '#log_completed_at' do
      context 'when a note is marked as completed' do
        before { admin_note.update(completed: true) }

        it 'stores the datetime for the task when it was completed' do
          expect(admin_note.completed_at).to_not be_nil
        end

        it 'updates the note status to `completed`' do
          expect(admin_note.status).to eql('completed')
        end
      end

      context 'when any other attribute is updated' do
        before { admin_note.update(completed: false) }

        it 'does not populate the completed_at' do
          expect(admin_note.completed_at).to be_nil
        end

        it 'does not update the note status' do
          expect { admin_note.update(completed: false) }.not_to(change { admin_note.status })
        end
      end
    end
  end
end

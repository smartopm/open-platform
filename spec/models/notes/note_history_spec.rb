# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Notes::NoteHistory, type: :model do
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

  describe 'note history crud' do
    it 'should create a note history record' do
      note.note_histories.create!(
        note_id: note.id,
        user_id: current_user.id,
        attr_changed: 'Attribute',
        initial_value: 'initial',
        updated_value: 'updated',
        action: %w[create update].sample,
        note_entity_type: note.class.name,
        note_entity_id: note.id,
      )
      expect(note.note_histories.length).to eql 1
    end
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:note_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:note_entity_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:note_entity_type).of_type(:string) }
    it { is_expected.to have_db_column(:attr_changed).of_type(:string) }
    it { is_expected.to have_db_column(:initial_value).of_type(:string) }
    it { is_expected.to have_db_column(:updated_value).of_type(:string) }
    it { is_expected.to have_db_column(:action).of_type(:string) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:note) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
  end

  describe 'methods' do
    it 'should return the note object when entity method is called' do
      note.note_histories.create!(
        note_id: note.id,
        user_id: current_user.id,
        attr_changed: 'Attribute',
        initial_value: 'initial',
        updated_value: 'updated',
        action: %w[create update].sample,
        note_entity_type: note.class.name,
        note_entity_id: note.id,
      )
      expect(note.note_histories.last.entity).to eql note
    end
  end
end

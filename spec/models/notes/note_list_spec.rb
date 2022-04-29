# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Notes::NoteList, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:process_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:process).class_name('Processes::Process').optional(true) }
    it { is_expected.to have_many(:notes).class_name('Notes::Note').dependent(:destroy) }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:status).with_values(active: 0, deleted: 1) }
  end

  describe 'callbacks' do
    let!(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let(:admin) { create(:admin_user, community_id: community.id) }
    let(:note_list) { create(:note_list, name: 'DRC LIST', community: community) }

    let!(:note) do
      create(:note,
             note_list_id: note_list.id,
             body: note_list.name,
             user_id: admin.id,
             author_id: admin.id)
    end
    context 'when note list is updated' do
      before { note_list.update(name: 'DRC') }

      it 'should updates note body' do
        expect(note.reload.body).to eql 'DRC'
      end
    end
  end
end

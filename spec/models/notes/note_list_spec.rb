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
    it { is_expected.to belong_to(:process).class_name('Processes::Process') }
    it { is_expected.to have_many(:notes).class_name('Notes::Note').dependent(:destroy) }
  end
end

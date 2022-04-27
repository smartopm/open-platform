# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Processes::Process, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:form_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:process_type).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:form).class_name('Forms::Form').optional(true) }
    it { is_expected.to have_one(:note_list).class_name('Notes::NoteList').dependent(:destroy) }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:status).with_values(active: 0, deleted: 1) }
  end
end

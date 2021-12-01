# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Forms::FormUser, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:form_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:status_updated_by_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:form) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:status_updated_by).class_name('Users::User') }
    it { is_expected.to have_many(:user_form_properties).dependent(:destroy) }
    it { is_expected.to have_one(:note).class_name('Notes::Note').dependent(:destroy) }
  end

  describe '#create_form_task' do
    let!(:user) { create(:admin_user) }
    let!(:form) { create(:form, community: user.community) }
    let!(:form_user) { create(:form_user, form: form, user: user, status_updated_by: user) }

    it 'creates a task' do
      previous_notes_count = Notes::Note.count

      form_user.create_form_task('nurudeen.dgdp.site')
      expect(Notes::Note.count).to eq(previous_notes_count + 1)

      latest_note = Notes::Note.order(:created_at).first
      expect(latest_note.user_id).to eq(user.id)
      expect(latest_note.author_id).to eq(user.id)
    end
  end
end

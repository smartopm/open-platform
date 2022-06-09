# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Labels::UserLabel, type: :model do
  let(:user) { create(:user_with_community) }
  let(:community) { user.community }
  let(:lead) { create(:lead, community: community) }
  let(:admin) { create(:admin_user, community: community) }
  let(:label) do
    create(:label, short_desc: 'On Target', grouping_name: 'Investment', community: community)
  end
  let!(:another_label) do
    create(:label, short_desc: 'Over Target', grouping_name: 'Investment', community: community)
  end
  let(:over_work_label) do
    create(:label, short_desc: 'Over', grouping_name: 'Work', community: community)
  end
  let(:progress_work_label) do
    create(:label, short_desc: 'Progress', grouping_name: 'Work', community: community)
  end
  let(:status_label) do
    create(:label, short_desc: 'Signed MOU', grouping_name: 'Status', community: community)
  end
  let!(:user_label) { create(:user_label, label: label, user: lead) }
  let!(:new_user_label) { create(:user_label, label: over_work_label, user: user) }

  describe 'schema' do
    it { is_expected.to have_db_column(:label_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User').without_validating_presence }
    it { is_expected.to belong_to(:label).without_validating_presence }
  end

  describe 'validations' do
    describe '#validate_label_grouping_name' do
      context 'when a label with same grouping name already exist' do
        it 'raises error for lead' do
          expect do
            described_class.create!(user_id: lead.id, label_id: another_label.id)
          end.to raise_error(ActiveRecord::RecordInvalid,
                             'Validation failed: Label with grouping name already exists')
        end
      end

      it 'associates label to other users' do
        previous_count = described_class.where(user_id: user.id).count

        described_class.create!(user_id: user.id, label_id: progress_work_label.id)
        expect(described_class.where(user_id: user.id).count).to eql previous_count + 1
      end
    end

    describe '#lead_specific_labels' do
      context 'when visitor tries to use reserved labels' do
        it 'raises error' do
          expect do
            described_class.create!(user_id: user.id, label_id: another_label.id)
          end.to raise_error(ActiveRecord::RecordInvalid, 'Validation failed: Reserved label')
        end
      end

      context 'when lead tries to use reserved labels' do
        it 'associates label' do
          previous_count = described_class.where(user_id: lead.id).count

          described_class.create!(user_id: lead.id, label_id: status_label.id)
          expect(described_class.where(user_id: lead.id).count).to eql previous_count + 1
        end
      end
    end
  end
end

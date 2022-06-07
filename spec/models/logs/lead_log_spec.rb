# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Logs::LeadLog, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:acting_user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:log_type).of_type(:integer) }
    it do
      is_expected.to have_db_column(:amount).of_type(:decimal)
                                            .with_options(default: 0.0, precision: 11, scale: 2)
    end
    it do
      is_expected.to have_db_column(:deal_size).of_type(:decimal)
                                               .with_options(default: 0.0, precision: 11, scale: 2)
    end
    it do
      is_expected.to have_db_column(:investment_target)
        .of_type(:decimal)
        .with_options(default: 0.0, precision: 11, scale: 2)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:acting_user).class_name('Users::User') }
  end

  describe '#enums' do
    it do
      is_expected.to define_enum_for(:log_type)
        .with_values(
          event: 0, meeting: 1, signed_deal: 2, lead_status: 3, investment: 4, deal_details: 5,
        )
    end
  end

  describe 'validations' do
    context 'when log_type is investment' do
      before { allow(subject).to receive(:log_type) { 'investment' } }
      it { is_expected.to validate_presence_of(:amount) }
      it { is_expected.to validate_numericality_of(:amount).is_greater_than_or_equal_to(0) }
    end

    context 'when log_type is deal_details' do
      before { allow(subject).to receive(:log_type) { 'deal_details' } }
      it { is_expected.to validate_presence_of(:deal_size) }
      it { is_expected.to validate_presence_of(:investment_target) }
      it do
        is_expected.to validate_numericality_of(:deal_size).is_greater_than_or_equal_to(0)
      end
      it do
        is_expected.to validate_numericality_of(:investment_target).is_greater_than_or_equal_to(0)
      end
    end
  end

  describe 'callbacks' do
    describe '#associate_investment_label' do
      let(:user) { create(:user_with_community) }
      let(:community) { user.community }
      let(:admin) { create(:admin_user, community: community) }
      let(:label) do
        create(:label, short_desc: 'On Target', grouping_name: 'Investment', community: community)
      end
      let(:user_label) { create(:user_label, label: label, user: user) }
      let!(:deal_details_lead_log) do
        create(:lead_log,
               log_type: 'deal_details',
               deal_size: 120_000,
               investment_target: 10,
               user: user,
               community: community,
               acting_user_id: admin.id)
      end

      let(:investment_lead_log) do
        create(:lead_log,
               log_type: 'investment',
               amount: amount,
               user: user,
               community: community,
               acting_user_id: admin.id)
      end

      context "when existing 'On Target' label is present" do
        let(:amount) { 14_000 }
        before do
          user_label
          investment_lead_log
        end

        it "destroys existing 'On Target label" do
          expect(user.labels.find_by(grouping_name: 'Investment',
                                     short_desc: 'On Target')).to eql nil
        end

        it "associates 'Over Target' investment label to lead" do
          expect(user.labels.find_by(grouping_name: 'Investment').short_desc).to eql 'Over Target'
        end
      end

      context 'when total investment made is less than investment target' do
        let(:amount) { 100 }
        before { investment_lead_log }

        it "associates lead with 'On Target' label" do
          expect(user.labels.find_by(grouping_name: 'Investment').short_desc).to eql 'On Target'
        end
      end
    end
  end
end

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
    it { is_expected.to have_db_column(:amount).of_type(:float).with_options(default: 0.0) }
    it { is_expected.to have_db_column(:deal_size).of_type(:float).with_options(default: 0.0) }
    it {
      is_expected.to have_db_column(:investment_target).of_type(:float)
                                                       .with_options(default: 0.0)
    }
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
      it do
        is_expected.to validate_numericality_of(:investment_target).is_less_than_or_equal_to(100)
      end
    end
  end
end

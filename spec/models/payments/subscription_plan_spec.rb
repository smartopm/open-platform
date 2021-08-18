# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::SubscriptionPlan, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:plan_type).of_type(:integer) }
    it { is_expected.to have_db_column(:start_date).of_type(:date) }
    it { is_expected.to have_db_column(:end_date).of_type(:date) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:status).with_values(active: 0, in_active: 1).with_prefix }
    it {
      is_expected.to define_enum_for(:plan_type).with_values(
        starter: 0, basic: 1, standard: 2, premium: 3,
      ).with_prefix
    }
  end

  describe 'validations' do
    it { is_expected.to validate_numericality_of(:amount).is_greater_than(0) }
    it { is_expected.to validate_presence_of(:start_date) }
    it { is_expected.to validate_presence_of(:end_date) }
    it { is_expected.to validate_presence_of(:plan_type) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
  end

  describe 'callbacks' do
    let!(:user) { create(:user_with_community) }
    let!(:subscription_plan) { create(:subscription_plan, community_id: user.community_id) }

    it 'should call ensure_valid_dates on save' do
      expect(subscription_plan).to receive(:ensure_valid_dates)
      subscription_plan.save
    end
  end
end

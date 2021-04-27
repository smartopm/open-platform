# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PaymentPlan, type: :model do
  let(:user) { create(:user_with_community) }
  let(:land_parcel) { create(:land_parcel, community_id: user.community_id) }

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:land_parcel_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:plan_type).of_type(:string) }
    it { is_expected.to have_db_column(:start_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:percentage).of_type(:decimal) }
    it { is_expected.to have_db_column(:generated).of_type(:boolean) }
    it { is_expected.to have_db_column(:plot_balance).of_type(:decimal) }
    it { is_expected.to have_db_column(:pending_balance).of_type(:decimal) }
    it { is_expected.to have_db_column(:total_amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:monthly_amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:payment_day).of_type(:integer) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:invoices) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:land_parcel) }
  end

  describe 'validations' do
    it do
      is_expected.to validate_numericality_of(:payment_day)
        .only_integer
        .is_greater_than(0)
        .is_less_than_or_equal_to(28)
    end

    describe '#plan_uniqueness_per_duration' do
      context 'when payment plan already exist for a duration' do
        before do
          create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id)
        end

        it 'adds validation error for plan duration' do
          plan = user.payment_plans.build(
            land_parcel_id: land_parcel.id, start_date: Time.zone.now,
          )
          plan.valid?
          expect(plan.errors.full_messages)
            .to include('Start date Payment plan duration overlaps with other payment plans')
        end
      end

      context 'when payment plan does not exist for a duration' do
        it 'does not add validation error for plan duration' do
          plan = user.payment_plans.build(
            land_parcel_id: land_parcel.id, start_date: Time.zone.now,
          )
          plan.valid?
          expect(plan.errors.full_messages)
            .to_not include('Start date Payment plan duration overlaps with other payment plans')
        end
      end
    end
  end

  describe 'callbacks' do
    let!(:user) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:valuation) { create(:valuation, land_parcel_id: land_parcel.id) }

    it 'should generate monthly invoices for the year' do
      expect(Invoice.count).to eql 0
      PaymentPlan.create(
        percentage: 50,
        status: 'active',
        plan_type: 'lease',
        start_date: Time.zone.now,
        user: user,
        plot_balance: 0,
        land_parcel: land_parcel,
        total_amount: 100,
        duration_in_month: 5,
        monthly_amount: 10,
      )
      expect(land_parcel.payment_plan.invoices.count).to eql 5
    end
  end
end

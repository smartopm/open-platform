# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Properties::PaymentPlan, type: :model do
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
    it { is_expected.to have_db_column(:installment_amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:payment_day).of_type(:integer) }
    it { is_expected.to have_db_column(:duration).of_type(:integer) }
    it { is_expected.to have_db_column(:frequency).of_type(:integer) }
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status)
        .with_values(active: 0, cancelled: 1, deleted: 2)
    end

    it do
      is_expected.to define_enum_for(:frequency)
        .with_values(daily: 0, weekly: 1, monthly: 2, quarterly: 3)
    end
  end

  describe 'associations' do
    it { is_expected.to have_many(:plan_payments) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:land_parcel) }
    it { is_expected.to have_many(:invoices).class_name('Payments::Invoice').dependent(:nullify) }
    it do
      is_expected.to have_many(:wallet_transactions)
        .class_name('Payments::WalletTransaction')
        .dependent(:nullify)
    end
    it do
      is_expected.to have_many(:plan_payments)
        .class_name('Payments::PlanPayment')
    end
    it { is_expected.to have_many(:plan_ownerships) }
  end

  describe 'validations' do
    it do
      is_expected.to validate_numericality_of(:payment_day)
        .only_integer
        .is_greater_than(0)
        .is_less_than_or_equal_to(28)
    end
  end

  describe 'callbacks' do
    let!(:user) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:valuation) { create(:valuation, land_parcel_id: land_parcel.id) }

    it 'creates pending-balance on create' do
      plan = Properties::PaymentPlan.create(
        percentage: 50,
        status: 'active',
        plan_type: 'lease',
        start_date: Time.zone.now,
        user: user,
        plot_balance: 0,
        land_parcel: land_parcel,
        total_amount: 100,
        duration: 5,
        installment_amount: 10,
      )
      expect(plan.pending_balance).to eql 50
    end
  end
end

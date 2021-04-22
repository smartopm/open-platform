# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Properties::PaymentPlan, type: :model do
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
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:land_parcel) }
    it { is_expected.to have_many(:invoices).class_name('Payments::Invoice').dependent(:nullify) }
    it { is_expected.to have_many(:wallet_transactions).dependent(:nullify) }
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

    it 'should generate monthly invoices for the year' do
      expect(Payments::Invoice.count).to eql 0
      Properties::PaymentPlan.create(
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

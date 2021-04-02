# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PaymentPlan, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:land_parcel_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:plan_type).of_type(:string) }
    it { is_expected.to have_db_column(:start_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:percentage).of_type(:string) }
    it { is_expected.to have_db_column(:generated).of_type(:boolean) }
    it { is_expected.to have_db_column(:plot_balance).of_type(:integer) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:invoices) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:land_parcel) }
  end

  describe 'callbacks' do
    let!(:user) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:valuation) { create(:valuation, land_parcel_id: land_parcel.id) }

    it 'should generate monthly invoices for the year' do
      expect(Invoice.count).to eql 0
      PaymentPlan.create(
        percentage: '50',
        status: 'active',
        plan_type: 'lease',
        start_date: Time.zone.now,
        user: user,
        plot_balance: 0,
        land_parcel: land_parcel,
        total_amount: 100,
      )
      expect(land_parcel.payment_plan.invoices.count).to eql 12
    end
  end
end

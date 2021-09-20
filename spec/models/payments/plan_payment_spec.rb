# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::PlanPayment, type: :model do
  let!(:user) do
    create(:user_with_community, ext_ref_id: '396745', email: 'demo@xyz.com',
                                 phone_number: '260123456')
  end
  let!(:community) { user.community }
  let!(:land_parcel) do
    create(:land_parcel, community_id: community.id,
                         parcel_number: 'Plot001', parcel_type: 'Basic')
  end
  let!(:payment_plan) do
    create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id,
                          pending_balance: 1200, installment_amount: 100)
  end
  let!(:transaction) do
    create(:transaction, user_id: user.id, community_id: community.id, depositor_id: user.id,
                         amount: 500)
  end
  let!(:plan_payment) do
    create(:plan_payment, user_id: user.id, community_id: community.id,
                          transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                          amount: 500, manual_receipt_number: '12345')
  end
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:transaction_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:payment_plan_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:manual_receipt_number).of_type(:string) }
    it { is_expected.to have_db_column(:automated_receipt_number).of_type(:string) }
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status).with_values(paid: 0, cancelled: 1)
    end
  end

  describe 'validations' do
    it { is_expected.to validate_numericality_of(:amount).is_greater_than(0) }

    context 'when a paid payment with same receipt number exist' do
      it 'raises an error' do
        expect do
          payment_plan.plan_payments.create!(transaction_id: transaction.id, user_id: user.id,
                                             community_id: community.id, amount: 100.0,
                                             manual_receipt_number: '12345')
        end.to raise_error(
          ActiveRecord::RecordInvalid,
          'Validation failed: Receipt number already exists',
        )
      end

      context 'when a paid payment with same receipt number does not exist' do
        before { plan_payment.update(status: :cancelled) }
        it 'creates plan payment without error' do
          payment_plan.plan_payments.create!(transaction_id: transaction.id, user_id: user.id,
                                             community_id: community.id, amount: 100.0,
                                             manual_receipt_number: '12345')
        end
      end
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user_transaction) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:payment_plan).class_name('Properties::PaymentPlan') }
  end
end

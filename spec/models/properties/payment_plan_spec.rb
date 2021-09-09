# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Properties::PaymentPlan, type: :model do
  let(:user) { create(:user_with_community) }
  let(:community) { user.community }
  let(:land_parcel) { create(:land_parcel, community_id: community.id) }
  let(:new_land_parcel) { create(:land_parcel, community_id: community.id) }
  let(:payment_plan) do
    create(
      :payment_plan,
      land_parcel_id: land_parcel.id,
      user_id: user.id,
      installment_amount: 100,
      duration: 12,
    )
  end
  let(:new_payment_plan) do
    create(
      :payment_plan,
      land_parcel_id: land_parcel.id,
      user_id: user.id,
      installment_amount: 100,
      duration: 12,
    )
  end
  let(:transaction) do
    create(
      :transaction,
      user_id: user.id,
      community_id: community.id,
      depositor_id: user.id,
      amount: 500,
    )
  end
  let(:plan_payment) do
    create(
      :plan_payment,
      user_id: user.id,
      community_id: community.id,
      transaction_id: transaction.id,
      payment_plan_id: payment_plan.id,
      amount: 500,
    )
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:land_parcel_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:plan_type).of_type(:integer) }
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
    it do
      is_expected.to have_db_column(:renewable).of_type(:boolean).with_options(default: true)
    end
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status)
        .with_values(active: 0, cancelled: 1, deleted: 2, completed: 3, general: 4)
    end

    it do
      is_expected.to define_enum_for(:frequency)
        .with_values(daily: 0, weekly: 1, monthly: 2, quarterly: 3)
    end

    it do
      is_expected.to define_enum_for(:plan_type)
        .with_values(starter: 0, basic: 1, standard: 2, premium: 3)
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

    it do
      is_expected.to validate_numericality_of(:duration)
        .is_greater_than_or_equal_to(1)
    end

    it do
      is_expected.to validate_numericality_of(:installment_amount)
        .is_greater_than_or_equal_to(1).on(:create)
    end
  end

  describe 'callbacks' do
    let!(:user) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let!(:valuation) { create(:valuation, land_parcel_id: land_parcel.id) }
    describe 'before_create' do
      describe '#set_pending_balance' do
        it 'creates pending-balance on create' do
          plan = Properties::PaymentPlan.create(
            percentage: 50,
            status: 'active',
            plan_type: 'basic',
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

      describe '#check_general_plan_existence' do
        context 'when a payment plan with general status already exits' do
          before { user.general_payment_plan }
          it 'raises error' do
            plan = Properties::PaymentPlan.create(
              percentage: 50,
              status: 'general',
              plan_type: 'basic',
              start_date: Time.zone.now,
              user: user,
              plot_balance: 0,
              land_parcel: land_parcel,
              total_amount: 100,
              duration: 5,
              installment_amount: 10,
            )
            expect(plan.persisted?).to eql false
            expect(plan.errors.full_messages[0]).to eql 'User General plan exists for the user'
          end
        end
      end
    end
  end

  describe 'Instance Method' do
    describe '#transfer_payments' do
      before do
        plan_payment
        new_payment_plan.transfer_payments(payment_plan)
        plan_payment.reload
      end

      # rubocop:disable Layout/LineLength
      it 'transfers payments to other payment plan' do
        payment = new_payment_plan.plan_payments.sample
        expect(plan_payment.note).to eql("Migrated to plan #{new_payment_plan.payment_plan_name} Id - #{new_payment_plan.id}")
        expect(plan_payment.status).to eql('cancelled')
        expect(payment.status).to eql('paid')
        expect(payment.amount).to eql(500.0)
        expect(payment.note).to eql("Migrated from plan #{payment_plan.payment_plan_name} Id - #{payment_plan.id}")
        expect(new_payment_plan.user_id).to eql(user.id)
      end
      # rubocop:enable Layout/LineLength
    end

    describe '#cancel!' do
      before { payment_plan.cancel! }
      it 'cancels the payment plan' do
        expect(payment_plan.status).to eql('cancelled')
        expect(payment_plan.pending_balance.to_f).to eql 0.0
        expect(payment_plan.renewable).to eql false
      end
    end
  end
end

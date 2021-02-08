# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Invoice, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:land_parcel_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:created_by_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:float) }
    it { is_expected.to have_db_column(:note).of_type(:string) }
    it { is_expected.to have_db_column(:description).of_type(:string) }
    it { is_expected.to have_db_column(:invoice_number).of_type(:integer) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:land_parcel) }
    it { is_expected.to belong_to(:created_by).optional }
  end

  describe 'callbacks' do
    let!(:user) { create(:user_with_community) }
    let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
    let(:invoice) { create(:invoice, community_id: user.community_id, land_parcel: land_parcel, user_id: user.id,
      status: 'in_progress', invoice_number: '1234', created_by: user) }

    it 'should call generate_event_log on save' do
      expect(invoice).to receive(:generate_event_log)
      invoice.save
    end

    it 'should call generate_event_log on update' do
      expect(invoice).to receive(:generate_event_log).with(:update)
      invoice.paid!
    end
  end
end

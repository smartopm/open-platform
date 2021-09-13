# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Logs::EntryRequest, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:nrc).of_type(:string) }
    it { is_expected.to have_db_column(:phone_number).of_type(:string) }
    it { is_expected.to have_db_column(:vehicle_plate).of_type(:string) }
    it { is_expected.to have_db_column(:reason).of_type(:string) }
    it { is_expected.to have_db_column(:other_reason).of_type(:string) }
    it { is_expected.to have_db_column(:concern_flag).of_type(:boolean) }
    it { is_expected.to have_db_column(:grantor_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:granted_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:source).of_type(:string) }
    it { is_expected.to have_db_column(:acknowledged).of_type(:boolean) }
    it { is_expected.to have_db_column(:visitation_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:start_time).of_type(:string) }
    it { is_expected.to have_db_column(:end_time).of_type(:string) }
    it { is_expected.to have_db_column(:company_name).of_type(:string) }
    it { is_expected.to have_db_column(:occurs_on).of_type(:string).with_options(default: []) }
    it { is_expected.to have_db_column(:visit_end_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:email).of_type(:string) }
  end
  describe 'Associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:grantor).class_name('Users::User').optional }
  end

  describe 'Basic usage' do
    before :each do
      @guard = FactoryBot.create(:user_with_community)
      @non_admin = FactoryBot.create(:user_with_community, community_id: @guard.community_id)
      @admin = FactoryBot.create(:admin_user, community_id: @guard.community_id)
    end

    it 'should be able to create a basic entrylog' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')
      expect(@entry_request.community_id).to eql @guard.community_id
      expect(@entry_request.pending?).to be true
      expect(Logs::EventLog.where(ref_id: @entry_request.id).count).to eql 0
    end

    it 'should work with only a name required' do
      @entry_request = @guard.entry_requests.create(name: '')
      expect(@entry_request.valid?).to be false
      @entry_request = @guard.entry_requests.create(name: 'Visitor Joe')
      expect(@entry_request.community_id).to eql @guard.community_id
      expect(@entry_request.pending?).to be true
      expect(Logs::EventLog.where(ref_id: @entry_request.id).count).to eql 0
    end

    it 'should handle an admin granting a request' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')
      @entry_request.grant!(@admin)
      expect(@entry_request.pending?).to be false
      expect(@entry_request.denied?).to be false
      expect(@entry_request.granted?).to be true
      expect(@entry_request.grantor_id).to eql @admin.id
      expect(Logs::EventLog.where(ref_id: @entry_request.id).count).to eql 1
    end

    it 'should handle a guard denying a request' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')
      @entry_request.deny!(@guard)
      expect(@entry_request.pending?).to be false
      expect(@entry_request.denied?).to be true
      expect(@entry_request.granted?).to be false
      expect(@entry_request.grantor_id).to eql @guard.id
      expect(Logs::EventLog.where(ref_id: @entry_request.id).count).to eql 1
    end

    it 'should create a task record for prospective client', skip_before: true do
      community = FactoryBot.create(:community)
      user = FactoryBot.create(:user, community: community)
      community.default_users = [user.id]
      community.save
      @entry_request = user.entry_requests.create(reason: 'Prospective Client',
                                                  name: 'Visitor Joe', nrc: '012345')
      create_task = @entry_request.create_entry_task

      expect(create_task[:user_id]).to eql user.id
      allow(@entry_request).to receive(:create_entry_task)
    end

    it 'should not throw error when guard grants entries' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')
      expect { @entry_request.deny!(@non_admin) }
        .not_to raise_exception
    end
  end

  describe '#send_feedback_link' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { admin.entry_requests.create(name: 'Mark Percival', reason: 'Visiting') }

    it 'sends feedback as sms' do
      feedback_link = "https://#{ENV['HOST']}/feedback"
      expect(Sms).to receive(:send).with(
        '+2347084123467',
        "Thank you for using our app, kindly use this link to give us feedback #{feedback_link}",
      )
      entry_request.send_feedback_link('+2347084123467')
    end
  end
end

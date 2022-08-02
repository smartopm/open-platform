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
    it { is_expected.to have_db_column(:revoker_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:granted_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:revoked_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:source).of_type(:string) }
    it { is_expected.to have_db_column(:acknowledged).of_type(:boolean) }
    it { is_expected.to have_db_column(:visitation_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:start_time).of_type(:string) }
    it { is_expected.to have_db_column(:end_time).of_type(:string) }
    it { is_expected.to have_db_column(:company_name).of_type(:string) }
    it { is_expected.to have_db_column(:occurs_on).of_type(:string).with_options(default: []) }
    it { is_expected.to have_db_column(:visit_end_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:email).of_type(:string) }
    it { is_expected.to have_db_column(:entry_request_state).of_type(:integer) }
  end
  describe 'Associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:grantor).class_name('Users::User').optional }
    it { is_expected.to belong_to(:revoker).class_name('Users::User').optional }
    it { is_expected.to have_many(:invites).dependent(:destroy) }
    it { is_expected.to have_many(:entry_times).through(:invites) }
  end

  describe 'Basic usage' do
    let!(:guard) { create(:security_guard) }
    let!(:non_admin) { create(:user, community: guard.community) }
    let!(:admin) { create(:admin_user, community: guard.community) }

    it 'should be able to create a basic entrylog' do
      entry_request = guard.entry_requests.create(reason: 'Visiting',
                                                  name: 'Visitor Joe', nrc: '012345')
      expect(entry_request.community_id).to eql guard.community_id
      expect(entry_request.pending?).to be true
      expect(Logs::EventLog.where(ref_id: entry_request.id).count).to eql 0
    end

    it 'should work with only a name required' do
      entry_request = guard.entry_requests.create(name: '')
      expect(entry_request.valid?).to be false
      entry_request = guard.entry_requests.create(name: 'Visitor Joe')
      expect(entry_request.community_id).to eql guard.community_id
      expect(entry_request.pending?).to be true
      expect(Logs::EventLog.where(ref_id: entry_request.id).count).to eql 0
    end

    it 'should handle an admin granting a request' do
      entry_request = guard.entry_requests.create(reason: 'Visiting',
                                                  name: 'Visitor Joe', nrc: '012345')
      entry_request.grant!(admin)
      expect(entry_request.pending?).to be false
      expect(entry_request.denied?).to be false
      expect(entry_request.granted?).to be true
      expect(entry_request.exited_at).to be_nil
      expect(entry_request.grantor_id).to eql admin.id
      expect(Logs::EventLog.where(ref_id: entry_request.id).count).to eql 1
    end

    it 'should handle a guard denying a request' do
      entry_request = guard.entry_requests.create(reason: 'Visiting',
                                                  name: 'Visitor Joe', nrc: '012345')
      entry_request.deny!(guard)
      expect(entry_request.pending?).to be false
      expect(entry_request.denied?).to be true
      expect(entry_request.granted?).to be false
      expect(entry_request.grantor_id).to eql guard.id
      expect(Logs::EventLog.where(ref_id: entry_request.id).count).to eql 1
    end

    it 'should create a task record for prospective client', skip_before: true do
      community = create(:community)
      user = create(:user, community: community, role: non_admin.role)
      community.default_users = [user.id]
      community.save
      entry_request = user.entry_requests.create(reason: 'Prospective Client',
                                                 name: 'Visitor Joe', nrc: '012345')
      create_task = entry_request.create_entry_task

      expect(create_task[:user_id]).to eql user.id
      allow(entry_request).to receive(:create_entry_task)
    end

    it 'should not throw error when guard grants entries' do
      entry_request = guard.entry_requests.create(reason: 'Visiting',
                                                  name: 'Visitor Joe', nrc: '012345')
      expect { entry_request.deny!(non_admin) }
        .not_to raise_exception
    end
  end

  describe '#send_feedback_link' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { admin.entry_requests.create(name: 'Test User', reason: 'Visiting') }

    it 'sends feedback as sms' do
      feedback_link = "https://#{ENV['HOST']}/feedback"
      expect(Sms).to receive(:send).with(
        '+2347084123467',
        "Thank you for using our app, kindly use this link to give us feedback #{feedback_link}",
      )
      entry_request.send_feedback_link('+2347084123467')
    end
  end

  describe '#closest_entry_time' do
    let(:admin) { create(:admin_user) }
    let(:community) { admin.community }
    let(:resident) { create(:resident, community: community) }
    let(:visitor) { create(:user, community: community) }
    let(:entry_request) { create(:entry_request, user: admin, community: community) }
    let(:invite) { admin.invite_guest(visitor.id, entry_request.id) }
    let(:other_invite) { resident.invite_guest(visitor.id, entry_request.id) }
    let!(:entry_time) do
      community.entry_times.create(
        visitation_date: Time.zone.now,
        starts_at: Time.zone.now - 8.hours,
        ends_at: Time.zone.now - 7.hours,
        visitable_id: invite.id,
        visitable_type: 'Logs::Invite',
      )
    end
    let!(:other_entry_time) do
      community.entry_times.create(
        visitation_date: Time.zone.now,
        starts_at: Time.zone.now - 3.hours,
        ends_at: Time.zone.now - 2.hours,
        visitable_id: other_invite.id,
        visitable_type: 'Logs::Invite',
      )
    end

    context 'when closest_entry_time is called' do
      it 'is expected to return closest entry time with respect to current time' do
        expect(entry_request.closest_entry_time.id).to eql(other_entry_time.id)
      end
    end
  end
end

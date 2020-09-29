# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EntryRequest, type: :model do
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
      expect(EventLog.where(ref_id: @entry_request.id).count).to eql 1
    end

    it 'should work with only a name required' do
      @entry_request = @guard.entry_requests.create(name: '')
      expect(@entry_request.valid?).to be false
      @entry_request = @guard.entry_requests.create(name: 'Visitor Joe')
      expect(@entry_request.community_id).to eql @guard.community_id
      expect(@entry_request.pending?).to be true
      expect(EventLog.where(ref_id: @entry_request.id).count).to eql 1
    end

    it 'should handle an admin granting a request' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')
      @entry_request.grant!(@admin)
      expect(@entry_request.pending?).to be false
      expect(@entry_request.denied?).to be false
      expect(@entry_request.granted?).to be true
      expect(@entry_request.grantor_id).to eql @admin.id
      expect(EventLog.where(ref_id: @entry_request.id).count).to eql 1
    end

    it 'should handle a guard denying a request' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')
      @entry_request.deny!(@guard)
      expect(@entry_request.pending?).to be false
      expect(@entry_request.denied?).to be true
      expect(@entry_request.granted?).to be false
      expect(@entry_request.grantor_id).to eql @guard.id
      expect(EventLog.where(ref_id: @entry_request.id).count).to eql 1
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
end

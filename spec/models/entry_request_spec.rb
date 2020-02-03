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
      expect(EventLog.where(ref_id: @entry_request.id).count).to eql 2
    end

    it 'should handle a guard denying a request' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')
      @entry_request.deny!(@guard)
      expect(@entry_request.pending?).to be false
      expect(@entry_request.denied?).to be true
      expect(@entry_request.granted?).to be false
      expect(@entry_request.grantor_id).to eql @guard.id
      expect(EventLog.where(ref_id: @entry_request.id).count).to eql 2
    end

    it 'should not throw error when guard grants entries' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')
      expect { @entry_request.deny!(@non_admin) }
        .not_to raise_exception(EntryRequest::Unauthorized)
    end

    it 'should notify an admin upon granting' do
      @entry_request = @guard.entry_requests.create(reason: 'Visiting',
                                                    name: 'Visitor Joe', nrc: '012345')

      expect(@entry_request.grant!(@non_admin)).to receive(:notify_admin)
      @entry_request.save
    end

    # commented out this for approval, only notifying admins after granting/denying
    # it 'should not notify for a showroom entry' do
    #   # But not for a showroom entry
    #   @entry_request = EntryRequest.new(reason: 'Visiting',
    #                                     community: @guard.community,
    #                                     user: @guard,
    #                                     name: 'Visitor Joe', nrc: '012345',
    #                                     source: 'showroom')
    #   expect(@entry_request).not_to receive(:notify_admin)
    #   @entry_request.save
    # end
  end
end

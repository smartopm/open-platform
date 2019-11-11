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
      @entry_request = @guard.entry_requests.create({reason: 'Visiting', name: "Visitor Joe", nrc: "012345"})
      expect(@entry_request.community_id).to eql @guard.community_id
      expect(@entry_request.pending?).to be true
    end

    it 'should handle an admin granting a request' do
      @entry_request = @guard.entry_requests.create({reason: 'Visiting', name: "Visitor Joe", nrc: "012345"})
      @entry_request.grant!(@admin)
      expect(@entry_request.pending?).to be false
      expect(@entry_request.denied?).to be false
      expect(@entry_request.granted?).to be true
      expect(@entry_request.grantor_id).to eql @admin.id
    end

    it 'should handle an admin denying a request' do
      @entry_request = @guard.entry_requests.create({reason: 'Visiting', name: "Visitor Joe", nrc: "012345"})
      @entry_request.deny!(@admin)
      expect(@entry_request.pending?).to be false
      expect(@entry_request.denied?).to be true
      expect(@entry_request.granted?).to be false
      expect(@entry_request.grantor_id).to eql @admin.id
    end

    it 'should prevent unauthorized granting' do
      @entry_request = @guard.entry_requests.create({reason: 'Visiting', name: "Visitor Joe", nrc: "012345"})
      expect { @entry_request.deny!(@non_admin) }
        .to raise_exception(EntryRequest::Unauthorized)

    end

  end
end

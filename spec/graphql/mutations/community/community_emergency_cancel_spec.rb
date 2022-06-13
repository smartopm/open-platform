# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Community::CommunityEmergencyCancel do
  describe 'cancelling an emergency request' do
    let!(:user) { create(:user_with_community) }
    let!(:role) { create(:role, name: 'resident') }
    let!(:resident) { create(:resident, role: role) }
    let!(:permission) do
      create(:permission, module: 'sos',
                          role: role, permissions: ['can_cancel_sos'])
    end

    let(:cancel_emergency) do
      <<~GQL
        mutation communityEmergencyCancel{
            communityEmergencyCancel{
            
            success
          }
        }
      GQL
    end
    before do
      allow(Sms.class).to receive(:send).with(any_args).and_return({})
    end

    it 'sned cancel emergency sms notification' do
      result = DoubleGdpSchema.execute(cancel_emergency,
                                       context: {
                                         current_user: resident,
                                         site_community: resident.community,
                                         user_role: resident.role,
                                       }).as_json

      expect(result.dig('data', 'communityEmergencyCancel', 'success')).to_not be_nil
      expect(result.dig('data', 'communityEmergencyCancel', 'success')).to eq true
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error when current user has no permissions' do
      result = DoubleGdpSchema.execute(cancel_emergency,
                                       context: {
                                         current_user: user,
                                         site_community: user.community,
                                         user_role: user.role,
                                       }).as_json

      expect(result.dig('data', 'communityEmergencyCancel', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end

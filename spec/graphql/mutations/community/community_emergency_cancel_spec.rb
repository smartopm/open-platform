# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Community::CommunityEmergencyCancel do
  describe 'cancelling an emergency request' do
    let!(:user) { create(:user_with_community) }

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
      variables = {}
      result = DoubleGdpSchema.execute(cancel_emergency, variables: variables,
                                                         context: {
                                                           current_user: user,
                                                           site_community: user.community,
                                                         }).as_json

      expect(result.dig('data', 'communityEmergencyCancel', 'success')).to_not be_nil
      expect(result.dig('data', 'communityEmergencyCancel', 'success')).to eq true
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error when no authorization is not provided' do
      variables = {}
      result = DoubleGdpSchema.execute(cancel_emergency, variables: variables,
                                                         context: {
                                                           site_community: user.community,
                                                         }).as_json

      expect(result.dig('data', 'communityEmergencyCancel', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
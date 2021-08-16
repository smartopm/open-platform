# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Community::CommunityEmergency do
  describe 'creating sos ticket for current user' do
    let!(:user) { create(:user_with_community) }
    let!(:guard) { create(:security_guard) }

    let(:create_sos_ticket) do
      <<~GQL
        mutation communityEmergency{
            communityEmergency{
            
            success
          }
        }
      GQL
    end
    before do
      allow(Sms.class).to receive(:send).with(any_args).and_return({})
    end

    it 'creates an sos ticket for current user' do
      result = DoubleGdpSchema.execute(create_sos_ticket, variables: nil,
                                                          context: {
                                                            current_user: user,
                                                            site_community: user.community,
                                                          }).as_json

      expect(result.dig('data', 'communityEmergency', 'success')).to_not be_nil
      expect(result.dig('data', 'communityEmergency', 'success')).to eq true
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error when no authorization is not provided' do
      result = DoubleGdpSchema.execute(create_sos_ticket, variables: nil,
                                                          context: {
                                                            site_community: user.community,
                                                          }).as_json

      expect(result.dig('data', 'communityEmergency', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end

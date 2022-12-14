# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Login::LoginPhoneComplete do
  describe 'phone auth process' do
    let!(:user) do
      create(:user_with_community,
             phone_token: '5f7f275243hj3536', phone_token_expires_at: 2.days.from_now)
    end

    let(:query) do
      <<~GQL
        mutation loginPhoneComplete($id: ID!, $token: String!) {
          loginPhoneComplete(id: $id, token: $token) {
            authToken
          }
        }
      GQL
    end

    it 'completes phone auth process' do
      variables = {
        id: user.id,
        token: '5f7f275243hj3536',
      }
      prev_log_count = Logs::EventLog.count
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: user.community,
                                              }).as_json

      expect(result.dig('data', 'loginPhoneComplete', 'authToken')).not_to be_nil
      expect(result['errors']).to be_nil
      expect(Logs::EventLog.count).to eq(prev_log_count + 1)
    end

    it 'handles expired tokens correctly' do
      variables = {
        id: user.id,
        token: '5f7f275243hj3536',
      }
      user.update(phone_token_expires_at: 1.minute.ago)
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: user.community,
                                              }).as_json
      expect(result['errors'][0]['message']).to eq('Invalid or expired phone token')
    end

    it 'handles invalid tokens correctly' do
      variables = {
        id: user.id,
        token: '5f7f275243hj3536',
      }
      user.update(phone_token: 'asdfgh')
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: user.community,
                                              }).as_json
      expect(result['errors'][0]['message']).to eq('Invalid or expired phone token')
    end
  end
end

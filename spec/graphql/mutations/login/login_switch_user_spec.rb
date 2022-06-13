# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Login::LoginSwitchUser do
  describe 'create user_switch log' do
    let!(:user) { create(:security_guard) }
    let!(:admin_user) do
      create(:admin_user, community: user.community)
    end

    let(:query) do
      <<~GQL
        mutation loginSwitchUser($id: ID!) {
            loginSwitchUser(id: $id) {
              authToken
          }
        }
      GQL
    end

    it 'switches guards' do
      variables = {
        id: user.id,
      }
      prev_log_count = Logs::EventLog.count
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin_user,
                                                site_community: admin_user.community,
                                              }).as_json

      expect(result.dig('data', 'loginSwitchUser', 'authToken')).not_to be_nil
      expect(result['errors']).to be_nil
      expect(Logs::EventLog.count).to eq(prev_log_count + 1)
    end
  end
end

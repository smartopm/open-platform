# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Login::LoginPublicUser do
  describe 'create token for public user' do
    let!(:user) { create(:security_guard) }
    let!(:another_user) do
      create(:admin_user, community: user.community, name: 'Public Submission')
    end

    let(:login_mutation) do
      <<~GQL
        mutation loginPublicUser {
          loginPublicUser {
              authToken
              }    
          }
      GQL
    end

    it 'logs public user in' do
      result = DoubleGdpSchema.execute(login_mutation,
                                       context: {
                                         site_community: user.community,
                                       }).as_json

      expect(result.dig('data', 'loginPublicUser', 'authToken')).not_to be_nil
    end
  end
end

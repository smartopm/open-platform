# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User::ResetPassword do
  describe 'reset password' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_reset_user_password])
    end
    let(:lead_user) { create(:lead) }
    let(:community) { lead_user.community }
    let(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }

    let(:mutation) do
      <<~GQL
        mutation resetPassword($username: String!, $password: String!, $userId: ID!){
            resetPassword(username: $username, userId: $userId, password: $password){
          success
          }
        }     
      GQL
    end

    context 'when current user is authorized' do
      it 'resets user password' do
        variables = {
          userId: lead_user.id,
          username: 'lead12dfg',
          password: 'bhdjij342j3j4442-223',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'resetPassword', 'success')).to eql true
      end
    end

    context 'when user is unauthorized' do
      it 'throws unauthorized error' do
        variables = {
          username: 'leadBlah123',
          password: 'dhfhfj-234-vvgess',
          userId: lead_user.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: lead_user,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end

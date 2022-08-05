# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User::ResetPasswordAfterLogin do
  describe 'reset password after first login' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_reset_user_password])
    end
    let(:admin) { create(:admin_user, role: admin_role) }

    let(:mutation) do
      <<~GQL
        mutation resetPasswordAfterLogin($password: String!, $userId: ID!){
            resetPasswordAfterLogin(userId: $userId, password: $password){
          authToken
          }
        }     
      GQL
    end

    context 'when user password is new' do
      it 'resets user password' do
        variables = {
          userId: admin.id,
          password: '12abcd1234blahbal',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: admin.community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'resetPasswordAfterLogin', 'authToken')).to_not be nil
      end
    end

    context 'when user password is same as old' do
      before { allow(SecureRandom).to receive(:alphanumeric).and_return('12abcd1234') }
      it 'resets user password' do
        variables = {
          userId: admin.id,
          password: '12abcd1234',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: admin.community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Please provide a new password'
      end
    end

    context 'when a random user id' do
      before { allow(SecureRandom).to receive(:alphanumeric).and_return('12abcd1234') }
      it 'throws user not found error' do
        variables = {
          password: '12abcd1234',
          userId: SecureRandom.uuid,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: admin.community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'User not found'
      end
    end
  end
end

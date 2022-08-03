# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Login::LoginUsernamePassword do
  describe 'reset password' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role)
    end
    let(:admin) { create(:admin_user, role: admin_role) }

    let(:mutation) do
      <<~GQL
        mutation loginUsernamePassword($username: String!, $password: String!){
          loginUsernamePassword(username: $username, password: $password){
            user {
              id
            }
            authToken
          }
        }     
      GQL
    end

    context 'when credentials are correct' do
      before { allow(SecureRandom).to receive(:alphanumeric).and_return('12abcd1234') }
      before { allow(SecureRandom).to receive(:uuid).and_return('12abcd1234') }
      it 'login is successful and returns user' do
        variables = {
          username: 'MarkTest12a',
          password: '12abcd1234',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: admin.community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'loginUsernamePassword', 'user', 'id')).to eql admin.id
        expect(result.dig('data', 'loginUsernamePassword', 'authToken')).to_not be nil
      end
    end

    context 'when wrong credentials' do
      before { allow(SecureRandom).to receive(:alphanumeric).and_return('12abcd1234') }
      before { allow(SecureRandom).to receive(:uuid).and_return('12abcd1234') }
      it 'returns authentication error' do
        variables = {
          username: 'MarkTest12a',
          password: 'wrong-password123',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: admin.community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'Wrong username or password'
      end
    end
  end
end

# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User do
  describe 'start the auth process' do
    let!(:user) do
      create(:user_with_community, email: 'user1@example.com',
                                   user_type: 'admin', provider: nil)
    end
    let!(:another_user) do
      create(:user, email: 'user2@example.com', provider: nil, community: user.community,
              role: user.role)
    end
    let!(:oauth_user) do
      create(:user, email: 'user3@example.com',
              user_type: 'admin', provider: 'google', community: user.community, role: user.role)
    end

    let(:query) do
      <<~GQL
        mutation loginEmail($email: String) {
          loginEmail(email: $email) {
            user {
              id
            }
          }
        }
      GQL
    end

    context 'when email is blank' do
      it 'raises email cannot be blank error' do
        variables = {
          email: '',
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  site_community: user.community,
                                                }).as_json

        expect(
          result.dig('errors', 0, 'message'),
        ).to eql 'Email cannot be blank'
      end
    end
    it 'returns a user account with valid email' do
      variables = {
        email: 'user1@example.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: user.community,
                                              }).as_json

      expect(result['errors']).to be_nil
      expect(result.dig('data', 'loginEmail', 'user', 'id')).to eql user.id
    end

    it 'returns error when user account not found' do
      variables = {
        email: 'user2@example.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'loginEmail', 'user', 'id')).to be_nil
      expect(
        result.dig('errors', 0, 'message'),
      ).to eql 'This account does not exist. Submit a request to create an account' \
               ' or use the correct account information to log in'
    end

    it 'checks user email not already authenticated via OAuth' do
      variables = {
        email: 'user3@example.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: oauth_user.community,
                                              }).as_json
      expect(result.dig('data', 'loginEmail', 'user', 'id')).to be_nil
      expect(
        result.dig('errors', 0, 'message'),
      ).to eql 'This account does not exist. Submit a request to create an account' \
               ' or use the correct account information to log in'
    end

    it 'checks the existence of the user account in a community' do
      variables = {
        email: 'user2@example.com',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: another_user.community,
                                              }).as_json
      expect(result.dig('data', 'loginEmail', 'user', 'id')).to eql another_user.id
      expect(result['errors']).to be_nil
    end
  end
end

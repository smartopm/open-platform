# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User do
  describe 'start the auth process' do
    let!(:user) { create(:admin_user, phone_number: '123456789') }
    let!(:another_user) { create(:user_with_community, phone_number: '0101010101') }

    let(:query) do
      <<~GQL
        mutation loginPhoneStart($phoneNumber: String) {
          loginPhoneStart(phoneNumber: $phoneNumber) {
            user {
              id
            }
          }
        }
      GQL
    end

    context 'when phone number is blank' do
      it 'raises phone number cannot be blank error' do
        variables = {
          phoneNumber: '',
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  site_community: user.community,
                                                }).as_json

        expect(
          result.dig('errors', 0, 'message'),
        ).to eql 'Phone number cannot be blank'
      end
    end

    context 'when user is deactivated' do
      before { user.deactivated! }

      it 'raises cannot access the app error' do
        variables = { phoneNumber: '123456789' }
        expect(Sms).not_to receive(:send)
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  site_community: user.community,
                                                }).as_json

        expect(result.dig('errors', 0, 'message')).to eql 'You do not have access to the app'
      end
    end

    it 'checks the existence of the phone number' do
      variables = { phoneNumber: '123456789' }

      expect(Sms).to receive(:send)
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: user.community,
                                              }).as_json

      expect(result['errors']).to be_nil
      expect(result.dig('data', 'loginPhoneStart', 'user', 'id')).to eql user.id
    end

    it 'checks the existence of the phone number' do
      variables = {
        phoneNumber: '0101010101',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'loginPhoneStart', 'user', 'id')).to be_nil
      expect(
        result.dig('errors', 0, 'message'),
      ).to eql 'This account does not exist. Submit a request to create an account' \
               ' or use the correct account information to log in'
    end

    it 'checks the existence of the phone number in a community' do
      variables = {
        phoneNumber: '0101010101',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: another_user.community,
                                              }).as_json
      expect(result.dig('data', 'loginPhoneStart', 'user', 'id')).to eql another_user.id
      expect(result['errors']).to be_nil
    end
  end
end

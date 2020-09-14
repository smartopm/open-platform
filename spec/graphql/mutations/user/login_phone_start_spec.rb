# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User do
  describe 'start the auth process' do
    let!(:user) { create(:user_with_community, phone_number: '123456789', user_type: 'admin') }
    let!(:another_user) { create(:user_with_community, phone_number: '0101010101') }

    let(:query) do
      <<~GQL
        mutation loginPhoneStart($phoneNumber: String!) {
          loginPhoneStart(phoneNumber: $phoneNumber) {
            user {
              id
            }
          }
        }
      GQL
    end

    it 'checks the existence of the phone number' do
      variables = {
        phoneNumber: '123456789',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: user.community,
                                              }).as_json

      expect(result.dig('errors')).to be_nil
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
      expect(result.dig('errors', 0, 'message')).to include 'User not found'
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
      expect(result.dig('errors')).to be_nil
    end
  end
end

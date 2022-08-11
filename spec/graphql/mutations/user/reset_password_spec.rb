# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User::ResetPassword do
  describe 'reset password' do
    let(:lead_user) { create(:lead) }
    let(:community) { lead_user.community }

    let(:mutation) do
      <<~GQL
        mutation resetPassword($email: String!){
            resetPassword(email: $email){
          success
          }
        }     
      GQL
    end

    context 'when current user is authorized' do
      it 'resets user password' do
        variables = {
          email: lead_user.email,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be nil
        expect(result.dig('data', 'resetPassword', 'success')).to eql true
      end
    end

    context 'when user eamil does not exist' do
      it 'returns not found error' do
        variables = {
          email: 'dhfhfj-234-vvgess',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message'))
          .to eql 'An account with this dhfhfj-234-vvgess does not exist'
      end
    end
  end
end

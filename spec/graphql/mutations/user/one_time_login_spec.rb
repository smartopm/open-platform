# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::User do
  describe 'sending a user a one time passcode' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_update_user_details can_send_one_time_login])
    end
    let!(:admin) { create(:admin_user, role: admin_role) }

    let!(:non_admin) { create(:user, community_id: admin.community_id) }
    let!(:resident) { create(:resident, community_id: admin.community_id) }

    let(:send_one_time_login) do
      <<~GQL
        mutation SendOneTimePasscode(
            $userId: ID!
          ) {
          result: oneTimeLogin(
              userId: $userId
            ) {
            success
          }
        }
      GQL
    end

    context 'when user is deactivated' do
      before { resident.deactivated! }

      it 'is expected not to send the one time login code to user' do
        variables = { userId: resident.id }

        expect(Sms).not_to receive(:send)
        result = DoubleGdpSchema.execute(send_one_time_login, variables: variables,
                                                              context: {
                                                                current_user: admin,
                                                                site_community: admin.community,
                                                              }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'The user does not have access to the app'
      end
    end

    it 'should allow an admin to send a one time login code' do
      variables = { userId: resident.id }

      expect(Sms).to receive(:send)
      result = DoubleGdpSchema.execute(send_one_time_login, variables: variables,
                                                            context: {
                                                              current_user: admin,
                                                              site_community: admin.community,
                                                            }).as_json
      expect(result.dig('data', 'result', 'success')).to be true
      expect(result['errors']).to be_nil
    end

    it 'should not allow non-admins to send one time login codes' do
      variables = { userId: resident.id }

      expect(Sms).not_to receive(:send)
      result = DoubleGdpSchema.execute(send_one_time_login, variables: variables,
                                                            context: {
                                                              current_user: non_admin,
                                                              site_community: admin.community,
                                                            }).as_json
      expect(result.dig('data', 'result')).to be nil
      expect(result['errors']).not_to be_nil
    end

    context 'when phone number is not present' do
      before { resident.update(phone_number: nil) }

      it 'raises error' do
        variables = { userId: resident.id }
        result = DoubleGdpSchema.execute(send_one_time_login, variables: variables,
                                                              context: {
                                                                current_user: admin,
                                                                site_community: admin.community,
                                                              }).as_json
        error_message = 'No phone number to send one time code to'
        expect(result['errors']).not_to be_nil
        expect(result.dig('errors', 0, 'message')).to eql error_message
      end
    end
  end
end

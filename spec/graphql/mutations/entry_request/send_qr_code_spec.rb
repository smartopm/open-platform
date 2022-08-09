# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EntryRequest::SendQrCode do
  describe 'send a qr code' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { admin.entry_requests.create(name: 'John Doe', reason: 'Visiting') }

    let(:send_qr_code_mutation) do
      <<~GQL
        mutation SendGuestQrCodeMutation($id: ID!, $guestEmail: String!) {
          result: sendGuestQrCode(id: $id, guestEmail: $guestEmail) {
            message
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'when event log is present of entry request' do
        it 'returns a granted entry request' do
          variables = { id: entry_request.id, guestEmail: 'email@gmail.com' }
          expect(GuestQrCodeJob).to receive(:perform_now).with(
            community: user.community,
            request_data: [{ request: entry_request, user: admin }],
            type: 'scan',
          )
          result = DoubleGdpSchema.execute(send_qr_code_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: community,
                                             user_role: admin.role,
                                           }).as_json

          expect(result.dig('data', 'result', 'message')).to eq('success')
        end
      end

      context 'when entry request is not present' do
        it 'raises error' do
          variables = { id: '1234', guestEmail: 'email@gmail.com' }
          result = DoubleGdpSchema.execute(send_qr_code_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             user_role: admin.role,
                                           }).as_json
          expect(result.dig('data', 'result')).to be_nil
          expect(result.dig('errors', 0, 'message')).to eql 'EntryRequest not found'
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not present' do
        it 'raises unauthorized error' do
          variables = { id: entry_request.id, guestEmail: 'email@gmail.com' }
          result = DoubleGdpSchema.execute(send_qr_code_mutation,
                                           variables: variables,
                                           context: {
                                             current_user: nil,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end

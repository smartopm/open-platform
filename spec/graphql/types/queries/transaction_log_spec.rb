# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::TransactionLog do
  describe 'transaction log queries' do
    let(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let(:admin) { create(:admin_user, community: community) }
    let(:resident) { create(:resident, community: community) }
    let(:client) { create(:client, community: community) }
    let(:role) { resident.role }
    let!(:permission) do
      create(:permission, module: 'transaction',
                          role: role,
                          permissions: 'can_view_transaction_logs')
    end
    let!(:admin_permissison) do
      create(:permission, module: 'transaction',
                          role: admin.role,
                          permissions: %w[can_view_transaction_logs
                                          can_view_all_transaction_logs])
    end
    let(:query) do
      <<~GQL
        query UserTransactionLogs($userId: ID!, $offset: Int, $limit: Int){
          userTransactionLogs(userId: $userId, offset: $offset, limit: $limit){
            amount
            transactionId
            transactionRef
          }
        }
      GQL
    end
    let(:transaction_logs_query) do
      <<~GQL
        query TransactionLogs {
          transactionLogs{
            amount
            transactionId
            transactionRef
          }
        }
      GQL
    end
    let!(:transaction_logs) do
      create(:transaction_log,
             transaction_id: '123421',
             transaction_ref: Time.zone.now,
             community: community,
             user: resident)

      create(:transaction_log,
             transaction_id: '123422',
             transaction_ref: Time.zone.now,
             community: community,
             user: client)
    end

    describe '#user_transaction_logs' do
      context 'when resident views transaction logs' do
        it 'retrieves transaction logs' do
          variables = { userId: resident.id }
          result = DoubleGdpSchema.execute(query, variables: variables, context:  {
                                             current_user: resident,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'userTransactionLogs').count).to eql 1
        end
      end

      context 'when client views transaction logs' do
        let(:role) { client.role }

        it 'retrieves transaction logs' do
          variables = { userId: client.id }
          result = DoubleGdpSchema.execute(query, variables: variables, context: {
                                             current_user: client,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'userTransactionLogs').count).to eql 1
        end
      end

      context 'when admin views client transaction logs' do
        it 'retrieves transaction logs' do
          variables = { userId: client.id }
          result = DoubleGdpSchema.execute(query, variables: variables, context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'userTransactionLogs').count).to eql 1
        end
      end

      context 'when client or resident tries to access transaction logs of another user' do
        let(:role) { client.role }

        it 'raises error' do
          variables = { userId: resident.id }
          result = DoubleGdpSchema.execute(query, variables: variables, context: {
                                             current_user: client,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to_not be_nil
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end

    describe '#transaction_logs' do
      context 'when admin views transaction logs' do
        it 'retrieves all transaction logs' do
          result = DoubleGdpSchema.execute(transaction_logs_query, context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'transactionLogs').count).to eql 2
        end
      end

      context 'when user is unauthorized' do
        it 'raises error' do
          result = DoubleGdpSchema.execute(transaction_logs_query, context: {
                                             current_user: resident,
                                             site_community: community,
                                           }).as_json
          expect(result['errors']).to_not be_nil
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end

    context 'when user is unauthorized' do
      it 'raise unauthorized error' do
        variables = { userId: user.id }
        result = DoubleGdpSchema.execute(query, variables: variables, context: {
                                           current_user: user,
                                           site_community: community,
                                         }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end

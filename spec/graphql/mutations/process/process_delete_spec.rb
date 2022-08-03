# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Process::ProcessUpdate do
  let(:admin_role) { create(:role, name: 'admin') }
  let!(:permission) do
    create(:permission, module: 'process',
                        role: admin_role,
                        permissions: %w[can_delete_process_template])
  end

  let(:user) { create(:user_with_community) }
  let(:community) { user.community }
  let(:admin) { create(:admin_user, community: community, role: admin_role) }
  let(:form) { create(:form, community: community) }
  let!(:process) { create(:process, community: community, form: form) }

  let(:mutation) do
    <<~GQL
      mutation processDeleteMutation($id: ID!) {
        processDelete(id: $id){
          success
        }
      }
    GQL
  end

  context 'when user is authorized and process is present' do
    it 'deletes process' do
      variables = { id: process.id }

      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: community,
                                                 }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'processDelete', 'success')).to eql true
    end
  end

  context 'when process is not found' do
    it 'raises process not found error' do
      variables = { id: '1234' }

      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: community,
                                                 }).as_json
      expect(result['errors']).to_not be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Process not found'
    end
  end

  context 'when user is unauthorized' do
    it 'raises unauthorized error' do
      variables = { id: process.id }

      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: community,
                                                 }).as_json
      expect(result['errors']).to_not be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end

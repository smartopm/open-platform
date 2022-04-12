# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Process::ProcessUpdate do
  describe 'updates process' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'process',
                          role: admin_role,
                          permissions: %w[can_update_process_template])
    end

    let(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let(:admin) { create(:admin_user, community: community, role: admin_role) }
    let(:form) { create(:form, community: community) }
    let!(:process) { create(:process, community: community, form: form) }

    let(:mutation) do
      <<~GQL
        mutation processUpdateMutation($id: ID!, $name: String, $process_type: String){
          processUpdate(id: $id, name: $name, processType: $process_type){
            process{
              name
              processType
            }
          }
        }
      GQL
    end

    context 'when user is authorized and process is present' do
      it 'should update process' do
        variables = {
          id: process.id,
          name: 'DRC',
          process_type: 'drc',
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'processUpdate', 'process', 'name')).to eql 'DRC'
        expect(result.dig('data', 'processUpdate', 'process', 'processType')).to eql 'drc'
      end
    end

    context 'when process not found' do
      it 'should raise process not found error' do
        variables = {
          id: '1234',
          name: 'DRC',
          process_type: 'drc',
        }

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
      it 'should raise unauthorized error' do
        variables = {
          id: process.id,
          name: 'DRC',
          process_type: 'drc',
        }

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
end

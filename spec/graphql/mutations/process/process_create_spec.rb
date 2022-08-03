# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Process::ProcessCreate do
  describe 'create process template' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'process',
                          role: admin_role,
                          permissions: %w[can_create_process_template])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:form) { create(:form, community: user.community) }
    let!(:note_list) { create(:note_list, community: user.community) }

    let(:mutation) do
      <<~GQL
        mutation processCreate(
          $name: String!,
          $formId: ID!,
          $noteListId: ID!
        ){
          processCreate(
            name: $name,
            formId: $formId,
            noteListId: $noteListId
          ){
            success
          }
        }
      GQL
    end

    context 'when user is an admin' do
      it 'creates a process' do
        variables = {
          name: 'Process Example',
          formId: form.id,
          noteListId: note_list.id,
        }
        prev_process_count = Processes::Process.count
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json

        expect(Processes::Process.count).to eql(prev_process_count + 1)
        expect(Processes::Process.order(:created_at).last.name).to eql(variables[:name])
        expect(result['errors']).to be_nil
      end

      it 'raises an error if note-list is not found' do
        variables = {
          name: 'Process Example',
          formId: form.id,
          noteListId: '1234567',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json

        expect(result.dig('errors', 0, 'message')).to eql 'Task List not found'
      end

      it 'raises an error if note list has process' do
        process = create(:process, community: admin.community)
        note_list.update(process_id: process.id)
        note_list.reload

        variables = {
          name: 'Process Example',
          formId: form.id,
          noteListId: note_list.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json

        expect(result.dig('errors', 0, 'message')).to eql(
          'This Task List is already linked to a process',
        )
      end

      it 'raises an error if form is not found' do
        variables = {
          name: 'Process Example',
          formId: '123456',
          noteListId: note_list.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json

        expect(result.dig('errors', 0, 'message')).to eql 'Form not found'
      end
    end

    context 'when user is not an admin' do
      it 'throws unauthorized error when user is not admin' do
        variables = {
          name: 'Process Example',
          formId: form.id,
          noteListId: note_list.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: user.community,
                                                     user_role: user.role,
                                                   }).as_json

        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end

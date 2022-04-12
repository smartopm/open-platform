# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Process do
  describe 'Process queries' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:admin) do
      create(:admin_user, role: admin_role, name: 'John Doe')
    end
    let!(:permission) do
      create(:permission, module: 'process',
                          role: admin_role,
                          permissions: %w[
                            can_view_process_templates can_create_process_template
                          ])
    end

    let(:developer_role) { create(:role, name: 'developer', community: admin.community) }
    let(:developer) { create(:developer, role: developer_role, community: admin.community) }
    let!(:developer_permissions) do
      create(:permission, module: 'process',
                          role: developer_role,
                          permissions: %w[])
    end

    describe 'Process Queries' do
      let(:process_templates_query) do
        <<~GQL
          query ProcessTemplates {
            processTemplates {
             id
             name
             processType
             form {
               id
             }
             noteList {
               id
             }
            }
          }
        GQL
      end

      let(:process_task_lists_query) do
        <<~GQL
          query ProcessTaskLists {
            processTaskLists {
             id
             name
            }
          }
        GQL
      end

      it 'throws an error of user has no permissions' do
        result = DoubleGdpSchema.execute(process_templates_query, context: {
                                           current_user: developer,
                                           site_community: developer.community,
                                         }).as_json

        expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      end

      it 'returns empty array if no process templates exist' do
        result = DoubleGdpSchema.execute(process_templates_query, context: {
                                           current_user: admin,
                                           site_community: admin.community,
                                         }).as_json

        expect(result['errors']).to be_nil
        expect(result.dig('data', 'processTemplates').length).to eql 0
      end

      describe 'process templates' do
        let!(:form_with_process) do
          create(:form, community: admin.community, status: :published,
                        roles: %w[])
        end

        let!(:process) do
          create(:process, community: admin.community, name: 'DRC', process_type: 'drc',
                           form: form_with_process)
        end

        it 'retrieves process templates' do
          create(:note_list, community: admin.community, process: process)

          result = DoubleGdpSchema.execute(process_templates_query, context: {
                                             current_user: admin,
                                             site_community: admin.community,
                                           }).as_json

          expect(result.dig('data', 'processTemplates').length).to eql 1
          expect(result.dig('data', 'processTemplates', 0, 'id')).to eql process.id
          expect(result.dig('data', 'processTemplates', 0, 'name')).to eql 'DRC'
          expect(result.dig('data', 'processTemplates', 0, 'processType')).to eql 'drc'
        end

        it 'retrieves the necessary note list' do
          note_list = create(:note_list, community: admin.community, process: process)

          result = DoubleGdpSchema.execute(process_templates_query, context: {
                                             current_user: admin,
                                             site_community: admin.community,
                                           }).as_json

          expect(result.dig('data', 'processTemplates', 0, 'noteList', 'id')).to eq note_list.id
        end

        it 'retrieves the necessary form' do
          create(:note_list, community: admin.community, process: process)

          result = DoubleGdpSchema.execute(process_templates_query, context: {
                                             current_user: admin,
                                             site_community: admin.community,
                                           }).as_json

          expect(result.dig(
                   'data', 'processTemplates', 0, 'form', 'id'
                 )).to eql form_with_process.id
        end
      end

      describe 'process task lists' do
        let!(:form_with_process) do
          create(:form, community: admin.community, status: :published,
                        roles: %w[])
        end

        let!(:process) do
          create(:process, community: admin.community, name: 'DRC', process_type: 'drc',
                           form: form_with_process)
        end

        it 'throws an error of user has no permissions' do
          result = DoubleGdpSchema.execute(process_task_lists_query, context: {
                                             current_user: developer,
                                             site_community: developer.community,
                                           }).as_json

          expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
        end

        it 'retrieves the necessary task list for a process' do
          note_list = create(
            :note_list,
            name: 'Task List 1',
            community: admin.community,
            process: process,
          )

          result = DoubleGdpSchema.execute(process_task_lists_query, context: {
                                             current_user: admin,
                                             site_community: admin.community,
                                           }).as_json

          expect(result.dig('data', 'processTaskLists', 0, 'id')).to eq note_list.id
          expect(result.dig('data', 'processTaskLists', 0, 'name')).to eq note_list.name
        end
      end
    end
  end
end

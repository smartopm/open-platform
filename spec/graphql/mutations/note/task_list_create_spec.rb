# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note do
  let!(:admin_role) { create(:role, name: 'admin') }
  let!(:resident_role) { create(:role, name: 'resident') }
  let!(:permission) do
    create(:permission, module: 'note',
                        role: admin_role,
                        permissions: %w[can_create_task_lists])
  end

  let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
  let!(:admin) do
    create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
  end

  let(:create_task_list_query) do
    <<~GQL
      mutation CreateTaskList(
        $body: String!
        ) {
        result:  taskListCreate(
          body:$body
          ){
          note {
              id
              body
              category
              status
          }
        }
      }
    GQL
  end

  describe 'creating a note' do
    it 'returns a created note with category' do
      variables = {
        userId: user.id,
        body: 'A note about the user',
        category: 'email',
        status: 'in_progress',
      }
      result = DoubleGdpSchema.execute(create_task_list_query, variables: variables,
                                                               context: {
                                                                 current_user: admin,
                                                                 site_community: user.community,
                                                               }).as_json

      note_list_result = result.dig('data', 'result', 'note')
      expect(note_list_result['id']).not_to be_nil
      expect(note_list_result['category']).to eql 'task_list'
      expect(note_list_result['status']).to eql 'not_started'
      expect(note_list_result['errors']).to be_nil
    end

    it 'raises unauthorized if current user is nil' do
      variables = {
        body: 'A note by site worker',
      }
      result = DoubleGdpSchema.execute(create_task_list_query, variables: variables,
                                                               context: {
                                                                 current_user: nil,
                                                                 site_community: user.community,
                                                               }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end

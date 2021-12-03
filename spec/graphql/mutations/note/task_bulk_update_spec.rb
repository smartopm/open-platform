# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteBulkUpdate do
  describe 'bulk update on tasks' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[can_bulk_assign_note])
    end
    let!(:site_worker_permission) do
      create(:permission, module: 'note',
                          role: site_worker_role,
                          permissions: %w[can_bulk_assign_note])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id,
                          role: admin_role, user_type: 'admin')
    end
    let!(:second_admin) do
      create(:admin_user, community_id: user.community_id,
                          role: admin_role, user_type: 'admin')
    end
    let!(:site_worker) do
      create(:site_worker, community_id: user.community_id,
                           role: site_worker_role, user_type: 'site_worker')
    end

    let!(:note) do
      admin.notes.create!(
        body: 'Note body',
        user_id: user.id,
        community_id: user.community_id,
        author_id: admin.id,
        flagged: true,
      )
    end
    let!(:another_note) do
      admin.notes.create!(
        body: 'Another note body',
        user_id: user.id,
        community_id: user.community_id,
        author_id: admin.id,
        flagged: true,
        category: 'call',
      )
    end

    let(:query) do
      <<~GQL
        mutation update_bulk($ids: [ID!]!, $completed: Boolean, $query: String) {
          noteBulkUpdate(
            ids: $ids
            completed: $completed
            query: $query
          ) {
            success
          }
        }
      GQL
    end

    it 'should handle bulk task update when provided with list of ids' do
      variables = {
        ids: [note.id, another_note.id],
        completed: true,
        query: '',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteBulkUpdate', 'success')).to eql true
    end

    it 'site worker should bulk task update by providing list of ids' do
      variables = {
        ids: [note.id, another_note.id],
        completed: true,
        query: '',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: site_worker,
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteBulkUpdate', 'success')).to eql true
    end

    it 'should handle bulk task update when provided with just a query' do
      variables = {
        ids: [],
        completed: true,
        query: 'category:call',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteBulkUpdate', 'success')).to eql true
    end

    it 'should handle bulk task update when provided with user query' do
      variables = {
        ids: [],
        completed: true,
        query: 'user:Test',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteBulkUpdate', 'success')).to eql true
    end

    it 'should fail when bulk task update request does not have a current user' do
      variables = {
        ids: [note.id, another_note.id],
        completed: true,
        query: '',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: admin.community,
                                              }).as_json
      expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      expect(result['errors']).not_to be_nil
    end
  end
end

# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteBulkUpdate do
  describe 'bulk update on tasks' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
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
        category: 'call'
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
        query: ''
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteBulkUpdate', 'success')).to eql true
    end

    it 'should handle bulk task update when provided with just a query' do
      variables = {
        ids: [],
        completed: true,
        query: 'category:call'
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
        query: 'user:Test'
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteBulkUpdate', 'success')).to eql true
    end
  end
end

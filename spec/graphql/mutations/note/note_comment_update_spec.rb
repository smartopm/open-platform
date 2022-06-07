# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteCommentUpdate do
  describe 'update for note comment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:custodian_role) { create(:role, name: 'custodian') }
    let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: custodian_role,
                          permissions: %w[can_update_note_comment])
    end
    let!(:site_worker_permission) do
      create(:permission, module: 'note',
                          role: site_worker_role,
                          permissions: %w[can_update_note_comment])
    end

    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:another_user) { create(:store_custodian, role: custodian_role) }
    let!(:site_worker) do
      create(:site_worker, community_id: another_user.community_id,
                           role: site_worker_role)
    end

    let!(:note) do
      admin.notes.create!(
        body: 'Note body',
        user_id: user.id,
        community_id: user.community_id,
        author_id: admin.id,
      )
    end
    let(:note_comment) { create(:note_comment, note: note, user: user, status: 'active') }

    let(:query) do
      <<~GQL
        mutation noteCommentUpdate($id: ID!, $body: String!, $taggedDocuments: [ID]) {
          noteCommentUpdate(id: $id, body: $body, taggedDocuments: $taggedDocuments){
            noteComment {
              id
              body
              taggedDocuments
            }
          }
        }
      GQL
    end

    it 'creates a comment under note' do
      variables = {
        id: note_comment.id,
        body: 'Updated body',
        taggedDocuments: ['t35672ghd8'],
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: another_user,
                                              }).as_json
      expect(result.dig('data', 'noteCommentUpdate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentUpdate', 'noteComment', 'body')).to eql 'Updated body'
      expect(result.dig('data', 'noteCommentUpdate', 'noteComment', 'taggedDocuments', 0)).to eql(
        't35672ghd8',
      )
      expect(result['errors']).to be_nil
    end

    it 'creates a comment under note with site worker as current user' do
      variables = {
        id: note_comment.id,
        body: 'Updated commment by site worker',
        taggedDocuments: [],
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: site_worker,
                                              }).as_json
      expect(result.dig('data', 'noteCommentUpdate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentUpdate', 'noteComment', 'body'))
        .to eql 'Updated commment by site worker'
      expect(result['errors']).to be_nil
    end

    it 'fails when current user is not in the context' do
      variables = {
        id: note_comment.id,
        body: 'Updated body',
        taggedDocuments: [],
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                              }).as_json
      expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      expect(result['errors']).not_to be_nil
    end
  end
end

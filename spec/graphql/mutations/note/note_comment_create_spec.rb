# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteCommentCreate do
  describe 'create for note comment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:custodian_role) { create(:role, name: 'custodian') }
    let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: custodian_role,
                          permissions: %w[can_create_note_comment])
    end
    let!(:site_worker_permission) do
      create(:permission, module: 'note',
                          role: site_worker_role,
                          permissions: %w[can_create_note_comment])
    end

    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:another_user) { create(:user_with_community, role: custodian_role) }
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

    let(:query) do
      <<~GQL
        mutation noteCommentCreate($noteId: ID!, $body: String!) {
          noteCommentCreate(noteId: $noteId, body: $body){
            noteComment {
              id
              body
            }
          }
        }
      GQL
    end

    it 'creates a comment under note' do
      variables = {
        noteId: note.id,
        body: 'Comment body',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: another_user,
                                              }).as_json
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'body')).to eql 'Comment body'
      expect(result['errors']).to be_nil
    end

    it 'creates a comment under note with current user as site worker' do
      variables = {
        noteId: note.id,
        body: 'Site worker Comment',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: site_worker,
                                              }).as_json
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'body'))
        .to eql 'Site worker Comment'
      expect(result['errors']).to be_nil
    end

    it 'raises unauthorized error if the context does not have current user' do
      variables = {
        noteId: note.id,
        body: 'Comment body',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                              }).as_json
      expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      expect(result['errors']).not_to be_nil
    end
  end
end

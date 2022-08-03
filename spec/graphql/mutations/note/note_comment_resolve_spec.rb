# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteCommentsResolve do
  describe 'create for note comment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:custodian_role) { create(:role, name: 'custodian') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[can_resolve_note_comments])
    end

    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:another_user) { create(:store_custodian, role: custodian_role) }

    let!(:note) do
      admin.notes.create!(
        body: 'Note body',
        user_id: user.id,
        community_id: user.community_id,
        author_id: admin.id,
      )
    end
    let!(:comment) do
      note.note_comments.create!(
        user_id: admin.id,
        status: 'active',
        body: 'This is the first comment',
        reply_required: true,
        reply_from_id: another_user.id,
        replied_at: nil,
        grouping_id: '9fafaba8-ad19-4a08-97e4-9b670d482cfa',
      )
    end

    let(:query) do
      <<~GQL
        mutation noteCommentsResolve($noteId: ID!, $groupingId: ID!) {
          noteCommentsResolve(noteId: $noteId, groupingId: $groupingId){
            success
          }
        }
      GQL
    end

    it 'marks discussion as resolved' do
      variables = {
        noteId: note.id,
        groupingId: '9fafaba8-ad19-4a08-97e4-9b670d482cfa',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'noteCommentsResolve', 'success')).to eql(true)
      expect(comment.reload.replied_at).not_to be_nil
    end

    it 'raises unauthorized error if the current-user is non-admin' do
      variables = {
        noteId: note.id,
        groupingId: '9fafaba8-ad19-4a08-97e4-9b670d482cfa',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: another_user,
                                              }).as_json
      expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      expect(result['errors']).not_to be_nil
    end
  end
end

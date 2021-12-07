# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteCommentDelete do
  describe 'delete for note comment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[can_delete_note_comment])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
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
        mutation noteCommentDelete($id: ID!) {
          noteCommentDelete(id: $id){
            commentDelete
          }
        }
      GQL
    end

    it 'deletes a comment under note' do
      variables = {
        id: note_comment.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json

      expect(result.dig('data', 'noteCommentDelete', 'commentDelete')).not_to be_nil
      expect(result.dig('data', 'noteCommentDelete', 'commentDelete')).to eql true
      expect(result['errors']).to be_nil
    end

    it 'raises unauthorized error if current user is nil/missing' do
      variables = {
        id: note_comment.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: nil,
                                              }).as_json
      expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      expect(result['errors']).not_to be_nil
    end
  end
end

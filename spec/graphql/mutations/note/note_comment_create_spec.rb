# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteCommentCreate do
  describe 'create for note comment' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
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
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'body')).to eql 'Comment body'
      expect(result['errors']).to be_nil
    end
  end
end

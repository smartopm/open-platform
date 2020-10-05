# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteCommentUpdate do
  describe 'update for note comment' do
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
    let(:note_comment) { create(:note_comment, note: note, user: user, status: 'active') }

    let(:query) do
      <<~GQL
        mutation noteCommentUpdate($id: ID!, $body: String!) {
          noteCommentUpdate(id: $id, body: $body){
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
        id: note_comment.id,
        body: 'Updated body',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'noteCommentUpdate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentUpdate', 'noteComment', 'body')).to eql 'Updated body'
      expect(result.dig('errors')).to be_nil
    end
  end
end

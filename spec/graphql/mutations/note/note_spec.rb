# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note do
  describe 'creating an note' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:site_worker) { create(:site_worker, community_id: user.community_id) }
    let!(:user_note) do
      create(:note, community_id: user.community_id,
                    user_id: user.id, author_id: admin.id)
    end

    let(:create_query) do
      <<~GQL
        mutation CreateNote($userId: ID!, $body: String!, $category: String) {
          result:  noteCreate(userId: $userId, body:$body, category: $category){
            note {
                id
                body
                category
            }
          }
        }
      GQL
    end

    let(:update_query) do
      <<~GQL
        mutation noteupdate(
          $id: ID!
          $body: String
          $flagged: Boolean
          $completed: Boolean
          $dueDate: String
        ) {
          noteUpdate(
            id: $id
            body: $body
            flagged: $flagged
            completed: $completed
            dueDate: $dueDate
          ) {
            note {
              flagged
              body
              id
              dueDate
            }
          }
        }
      GQL
    end
    let(:note_assign_query) do
      <<~GQL
        mutation noteAssign($noteId: ID!, $userId: ID!){
          noteAssign(noteId: $noteId, userId: $userId){
            assigneeNote
          }
        }
      GQL
    end

    it 'returns a created note with category' do
      variables = {
        userId: user.id,
        body: 'A note about the user',
        category: 'email',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('data', 'result', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'note', 'category')).to eql 'email'
      expect(result['errors']).to be_nil
    end

    it 'returns a created note with category when current user is a site worker' do
      variables = {
        userId: user.id,
        body: 'A note by site worker',
        category: 'email',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: site_worker,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('data', 'result', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'note', 'category')).to eql 'email'
      expect(result['errors']).to be_nil
    end

    it 'raises unauthorized if current user is nil' do
      variables = {
        userId: user.id,
        body: 'A note by site worker',
        category: 'email',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: nil,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'does not return a created note with the right category' do
      variables = {
        userId: user.id,
        body: 'A note about the user',
        category: 'anything',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'result', 'note', 'id')).to be_nil
      expect(result.dig('data', 'result', 'note', 'category')).to be_nil
    end

    it 'returns a created note' do
      variables = {
        userId: user.id,
        body: 'A note about the user',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('data', 'result', 'note', 'id')).not_to be_nil
      expect(result['errors']).to be_nil

      variable_updates = {
        id: result.dig('data', 'result', 'note', 'id'),
        body: 'A modified note about the user',
      }

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('data', 'noteUpdate', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'noteUpdate', 'note', 'body')).to include 'modified'
      expect(Notes::NoteHistory.count).to eql 2
      expect(result['errors']).to be_nil

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: user,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('data', 'noteUpdate', 'note', 'id')).to be_nil
      expect(Notes::NoteHistory.count).to eql 2
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'assigns or unassigns user' do
      variables = {
        userId: user.id,
        noteId: user_note.id,
      }

      result = DoubleGdpSchema.execute(note_assign_query, variables: variables,
                                                          context: {
                                                            current_user: admin,
                                                            site_community: user.community,
                                                          }).as_json

      expect(result.dig('data', 'noteAssign', 'assigneeNote')).not_to be_nil
      expect(result.dig('data', 'noteAssign', 'assigneeNote')).to include 'success'
      expect(Notes::NoteHistory.count).to eql 1
      expect(result['errors']).to be_nil
    end

    it 'assigns or unassigns user when current user is site worker' do
      variables = {
        userId: user.id,
        noteId: user_note.id,
      }

      result = DoubleGdpSchema.execute(note_assign_query, variables: variables,
                                                          context: {
                                                            current_user: site_worker,
                                                            site_community: user.community,
                                                          }).as_json

      expect(result.dig('data', 'noteAssign', 'assigneeNote')).not_to be_nil
      expect(result.dig('data', 'noteAssign', 'assigneeNote')).to include 'success'
      expect(Notes::NoteHistory.count).to eql 1
      expect(result['errors']).to be_nil
    end
  end
end

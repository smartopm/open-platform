# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note do
  describe 'creating an note' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:create_query) do
      <<~GQL
        mutation CreateNote($userId: ID!, $body: String!) {
          result: noteCreate(userId: $userId, body: $body) {
            note {
              id
              body
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

    it 'returns a created entry request' do
      variables = {
        userId: user.id,
        body: 'A note about the user',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                     }).as_json
      expect(result.dig('data', 'result', 'note', 'id')).not_to be_nil
      expect(result.dig('errors')).to be_nil

      variable_updates = {
        id: result.dig('data', 'result', 'note', 'id'),
        body: 'A modified note about the user',
      }

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: admin,
                                                     }).as_json
      expect(result.dig('data', 'noteUpdate', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'noteUpdate', 'note', 'body')).to include 'modified'
      expect(result.dig('errors')).to be_nil

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: user,
                                                     }).as_json
      expect(result.dig('data', 'noteUpdate', 'note', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end

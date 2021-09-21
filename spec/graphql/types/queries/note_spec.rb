# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Note do
  describe 'note queries' do
    let!(:site_worker) { create(:site_worker) }
    let!(:admin) { create(:admin_user, community_id: site_worker.community_id) }
    let!(:first_note) do
      admin.notes.create!(
        body: 'Note body',
        user_id: site_worker.id,
        description: 'Test task',
        category: 'emergency',
        community_id: site_worker.community_id,
        flagged: false,
        author_id: site_worker.id,
      )
    end

    let!(:second_note) do
      admin.notes.create!(
        body: 'Note body',
        user_id: site_worker.id,
        description: 'Test task',
        category: 'emergency',
        flagged: false,
        community_id: site_worker.community_id,
        author_id: site_worker.id,
      )
    end

    let!(:third_note) do
      admin.notes.create!(
        body: 'Note body',
        description: 'Test task',
        user_id: site_worker.id,
        category: 'emergency',
        flagged: true,
        community_id: site_worker.community_id,
        author_id: site_worker.id,
      )
    end

    let!(:fourth_note) do
      admin.notes.create!(
        body: 'Note body',
        description: 'Test task',
        user_id: site_worker.id,
        category: 'emergency',
        flagged: true,
        community_id: site_worker.community_id,
        author_id: site_worker.id,
      )
    end

    let!(:first_note_comment) do
      create(:note_comment,
             note: first_note,
             user: site_worker,
             status: 'active')
    end
    let(:second_note_comment) do
      create(:note_comment,
             note: second_note,
             user: site_worker,
             status: 'active')
    end

    let(:notes_query) do
      %(query {
            allNotes {
                  category
                  description
                  flagged
                  body
                  createdAt
                  userId
                  user {
                      name
                      id
                  }
              }
          })
    end

    let(:note_query) do
      %(query {
                task(taskId: "#{third_note.id}") {
                    category
                    description
                    flagged
                    body
                    createdAt
                    userId
                    user {
                        name
                        id
                    }
                }
            })
    end

    let(:note_comments_query) do
      %(query {
        taskComments(taskId: "#{first_note.id}") {
                    id
                    body
                    userId
                    createdAt
                }
            })
    end

    let(:flagged_notes_query) do
      %(query {
            flaggedNotes {
                    category
                    description
                    flagged
                    body
                    createdAt
                    userId
                    user {
                        name
                        id
                    }
                }
            })
    end

    let(:note_count) do
      %(query {
            myTasksCount
            })
    end

    it 'should retrieve list of notes' do
      result = DoubleGdpSchema.execute(notes_query, context: {
                                         current_user: admin,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('data', 'allNotes').length).to eql 2
      expect(result.dig('data', 'allNotes', 0, 'user', 'id')).to eql admin.id
      expect(result.dig('data', 'allNotes', 0, 'userId')).to eql admin.id
    end

    it 'should raise an error when the current user is null' do
      result = DoubleGdpSchema.execute(notes_query, context: {
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include('Must be logged in to perform this action')
    end

    it 'should retrieve list of flagged notes' do
      result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('data', 'flaggedNotes').length).to eql 2
    end

    it 'should raise unauthorised error when current user is nil' do
      result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                         current_user: nil,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include('Must be logged in to perform this action')
    end

    it 'should retrieve note by id with site worker as current user' do
      result = DoubleGdpSchema.execute(note_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('data', 'task')).not_to be_empty
    end

    it 'should raise unauthorised error if request does not have a current user' do
      result = DoubleGdpSchema.execute(note_query, context: {
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include('Must be logged in to perform this action')
    end

    it 'should retrieve note comments with site manager as current user' do
      result = DoubleGdpSchema.execute(note_comments_query, context: {
                                         current_user: admin,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('data', 'taskComments')).not_to be_empty
    end

    it 'should retrieve note comments with site worker as current user' do
      result = DoubleGdpSchema.execute(note_comments_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('data', 'taskComments')).not_to be_empty
    end

    it 'should raise unautorised error/
      for retrieve comments when current user is nil' do
      result = DoubleGdpSchema.execute(note_comments_query, context: {
                                         current_user: nil,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include('Must be logged in to perform this action')
    end
  end
end
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
        description: 'Test parent task 1',
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
        description: 'Test parent task 2',
        user_id: site_worker.id,
        category: 'emergency',
        flagged: true,
        community_id: site_worker.community_id,
        author_id: site_worker.id,
        due_date: Time.zone.today,
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
      <<~GQL
        query flaggedNotes($query: String) {
          flaggedNotes(query: $query) {
            #{task_fragment}
            subTasks {
              #{task_fragment}
              subTasks {
                #{task_fragment}
                subTasks {
                  #{task_fragment}
                }
              }
            }
          }
        }
      GQL
    end

    let(:task_fragment) do
      <<~GQL
        body
        createdAt
        id
        completed
        category
        description
        dueDate
        user {
          id
          name
          imageUrl
        }
        author {
          id
          name
        }
        assignees {
          id
          name
          imageUrl
        }
        assigneeNotes {
          userId
          reminderTime
        }
      GQL
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

    describe 'sub tasks' do
      let!(:first_sub_task) do
        admin.notes.create!(
          body: 'Subtask body',
          description: 'Subtask 1',
          user_id: site_worker.id,
          category: 'other',
          flagged: true,
          community_id: site_worker.community_id,
          author_id: site_worker.id,
          due_date: Time.zone.today,
          parent_note_id: third_note.id,
        )
      end

      let!(:second_sub_task) do
        admin.notes.create!(
          body: 'Subtask body',
          description: 'Subtask 2',
          user_id: site_worker.id,
          category: 'other',
          flagged: true,
          community_id: site_worker.community_id,
          author_id: site_worker.id,
          due_date: Time.zone.today,
          parent_note_id: fourth_note.id,
        )
      end

      let!(:third_sub_task) do
        admin.notes.create!(
          body: 'Subtask body',
          description: 'Subtask 3',
          user_id: site_worker.id,
          category: 'other',
          flagged: true,
          community_id: site_worker.community_id,
          author_id: site_worker.id,
          due_date: Time.zone.today,
          parent_note_id: first_sub_task.id,
        )
      end

      let!(:fourth_sub_task) do
        admin.notes.create!(
          body: 'Subtask body',
          description: 'Subtask 4',
          user_id: site_worker.id,
          category: 'other',
          flagged: true,
          community_id: site_worker.community_id,
          author_id: site_worker.id,
          due_date: Time.zone.today,
          parent_note_id: third_sub_task.id,
        )
      end

      it 'retrieves tasks and their sub tasks' do
        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: site_worker,
                                           site_community: site_worker.community,
                                         }).as_json

        expect(result.dig('data', 'flaggedNotes').length).to eql 6
        expect(result.dig('data', 'flaggedNotes')
                     .select { |task| task['subTasks'].present? }.size).to eq(4)
      end

      it 'retrieves nested sub tasks up to 3 levels deep' do
        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: site_worker,
                                           site_community: site_worker.community,
                                         }).as_json

        parent_task = result.dig('data', 'flaggedNotes')
                            .find { |task| task['description'] == 'Test parent task 1' }
        expect(parent_task).not_to be_nil
        expect(
          parent_task['subTasks'][0]['subTasks'][0]['subTasks'][0]['description'],
        ).to eq('Subtask 4')
      end
    end

    it 'should retrieve list of flagged notes without due date' do
      variables = { query: 'due_date:nil' }
      result = DoubleGdpSchema.execute(flagged_notes_query,
                                       variables: variables,
                                       context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to be_nil
      expect(result.dig('data', 'flaggedNotes').length).to eql 1
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

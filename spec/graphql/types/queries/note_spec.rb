# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Note do
  describe 'note queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[
                            can_fetch_task_comments can_fetch_flagged_notes
                            can_fetch_task_by_id can_fetch_task_histories
                            can_get_task_count can_get_task_stats can_get_own_tasks
                            can_fetch_all_notes can_fetch_user_notes
                          ])
    end
    let!(:site_worker_permission) do
      create(:permission, module: 'note',
                          role: site_worker_role,
                          permissions: %w[can_fetch_task_comments can_fetch_flagged_notes
                                          can_fetch_task_by_id can_fetch_task_histories
                                          can_get_task_count can_get_task_stats can_get_own_tasks])
    end
    let!(:admin) { create(:admin_user, role: admin_role) }
    let!(:site_worker) { create(:site_worker, role: site_worker_role) }

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
        category: 'form',
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

    let(:processes_query) do
      <<~GQL
        query processes($query: String) {
          processes(query: $query) {
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

    let(:projects_query) do
      <<~GQL
        query GetProjects($offset: Int, $limit: Int) {
          projects(offset: $offset, limit: $limit) {
            #{task_fragment}
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
          avatarUrl
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
        parentNote {
          id
        }
        documents
      GQL
    end

    let(:note_sub_tasks_query) do
      %(query($taskId: ID!) {
        taskSubTasks(taskId: $taskId) {
          category
          description
          flagged
          body
          createdAt
          user {
            name
            id
          }
          parentNote {
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
        .to include('Unauthorized')
    end

    it 'should retrieve list of flagged notes' do
      result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('data', 'flaggedNotes').length).to eql 2
    end

    it 'should retrieve list of processes' do
      result = DoubleGdpSchema.execute(processes_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('data', 'processes').length).to eql 1
    end

    it 'fetches projects' do
      create(:form, name: 'DRC Project Review Process V2', community: site_worker.community)

      result = DoubleGdpSchema.execute(projects_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json

      expect(result['errors']).to be_nil
    end

    it 'should retrieve list of processes without due date' do
      variables = { query: 'due_date:nil' }
      result = DoubleGdpSchema.execute(processes_query,
                                       variables: variables,
                                       context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to be_nil
      expect(result.dig('data', 'processes').length).to eql 1
    end

    it 'should raise unauthorised error when current user is nil' do
      result = DoubleGdpSchema.execute(processes_query, context: {
                                         current_user: nil,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include('Unauthorized')
    end

    it 'returns empty array if no flagged notes exits' do
      site_worker.community.notes.where(flagged: true).destroy_all
      result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json

      expect(result['errors']).to be_nil
      expect(result.dig('data', 'flaggedNotes').length).to eql 0
    end

    context 'sub tasks' do
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

      it 'retrieves parent tasks' do
        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: site_worker,
                                           site_community: site_worker.community,
                                         }).as_json

        expect(result.dig('data', 'flaggedNotes').length).to eql 2
        expect(result.dig('data', 'flaggedNotes')
                     .select { |task| task['subTasks'].present? }.size).to eq(2)
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
        .to include('Unauthorized')
    end

    it 'should retrieve note by id with site worker as current user' do
      result = DoubleGdpSchema.execute(note_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('data', 'task')).not_to be_empty
    end

    it 'should retrieve sub tasks of a parent note' do
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

      variables = {
        taskId: third_note.id,
      }
      result = DoubleGdpSchema.execute(note_sub_tasks_query, context: {
                                         current_user: site_worker,
                                         site_community: site_worker.community,
                                       }, variables: variables).as_json
      expect(result.dig('data', 'taskSubTasks')).not_to be_empty
      expect(result.dig('data', 'taskSubTasks', 0, 'parentNote', 'id')).to eq third_note.id
    end

    it 'should raise unautorised error/
      for retrieve comments when current user is nil' do
      variables = {
        taskId: third_note.id,
      }
      result = DoubleGdpSchema.execute(note_sub_tasks_query, context: {
                                         current_user: nil,
                                         site_community: site_worker.community,
                                       }, variables: variables).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include('Unauthorized')
    end

    it 'should raise unauthorised error if request does not have a current user' do
      result = DoubleGdpSchema.execute(note_query, context: {
                                         site_community: site_worker.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include('Unauthorized')
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
        .to include('Unauthorized')
    end
  end
end

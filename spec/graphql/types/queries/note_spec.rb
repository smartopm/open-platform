# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Note do
  describe 'note queries' do
    let(:admin_role) { create(:role, name: 'admin') }
    let(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[
                            can_fetch_task_comments
                            can_fetch_flagged_notes
                            can_fetch_task_by_id
                            can_fetch_task_histories
                            can_get_task_count
                            can_get_task_stats
                            can_get_own_tasks
                            can_fetch_all_notes
                            can_fetch_user_notes
                            can_fetch_tagged_comments
                            can_view_task_lists
                            can_get_comment_stats
                            can_get_replies_requested_comments
                            can_fetch_process_comments
                            can_fetch_project_document_comments
                          ])
    end
    let!(:site_worker_permission) do
      create(:permission, module: 'note',
                          role: site_worker_role,
                          permissions: %w[can_fetch_task_comments can_fetch_flagged_notes
                                          can_fetch_task_by_id can_fetch_task_histories
                                          can_get_task_count can_get_task_stats can_get_own_tasks])
    end
    let(:site_worker) { create(:site_worker, role: site_worker_role) }
    let(:community) { site_worker.community }
    let!(:admin) do
      create(:admin_user, role: admin_role, community: community, name: 'John Doe')
    end
    let(:searchable_user) { create(:user, name: 'Henry Tim', community_id: community.id) }

    let(:developer_role) { create(:role, name: 'developer', community: community) }
    let(:developer) { create(:developer, role: developer_role, community: community) }
    let!(:developer_permissions) do
      create(:permission, module: 'note',
                          role: developer_role,
                          permissions: %w[can_fetch_flagged_notes can_fetch_task_comments
                                          can_fetch_tagged_comments])
    end
    let(:consultant_role) { create(:role, name: 'consultant', community: community) }
    let(:consultant) { create(:consultant, role: consultant_role, community: community) }
    let!(:consultant_permissions) do
      create(:permission, module: 'note',
                          role: consultant_role,
                          permissions: %w[can_fetch_flagged_notes can_fetch_task_comments
                                          can_fetch_comments_on_assigned_tasks])
    end

    let!(:first_note) do
      admin.notes.create!(
        body: 'Note body 1',
        user_id: site_worker.id,
        description: 'Test task 1',
        category: 'emergency',
        community_id: community.id,
        flagged: false,
        author_id: site_worker.id,
      )
    end

    let!(:second_note) do
      admin.notes.create!(
        body: 'Note body 2 ',
        user_id: site_worker.id,
        description: 'Test task 2',
        category: 'emergency',
        flagged: false,
        community_id: community.id,
        author_id: site_worker.id,
      )
    end

    let!(:third_note) do
      admin.notes.create!(
        body: 'Note body 3',
        description: 'Test parent task 1',
        user_id: site_worker.id,
        category: 'form',
        flagged: true,
        community_id: community.id,
        author_id: site_worker.id,
        completed: false,
      )
    end

    let!(:fourth_note) do
      admin.notes.create!(
        body: 'Note body 4',
        description: 'Test parent task 2',
        user_id: site_worker.id,
        category: 'emergency',
        flagged: true,
        community_id: community.id,
        author_id: site_worker.id,
        due_date: Time.zone.now.end_of_day,
        completed: false,
      )
    end

    let!(:first_note_comment) do
      create(:note_comment,
             note: first_note,
             body: 'Test note comment',
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
                    id
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
      %(query($taskId: ID!) {
        taskComments(taskId: $taskId) {
          id
          body
          userId
          createdAt
          user {
            id
            name
            imageUrl
          }
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
        query GetProjects(
          $processId: ID!
          $offset: Int,
          $limit: Int,
          $step: String,
          $completedPerQuarter: String,
          $submittedPerQuarter: String,
          $lifeTimeCategory: String,
          $repliesRequestedStatus: String
        ) {
          projects(
            processId: $processId,
            offset: $offset,
            limit: $limit,
            step: $step,
            completedPerQuarter: $completedPerQuarter,
            submittedPerQuarter: $submittedPerQuarter,
            lifeTimeCategory: $lifeTimeCategory,
            repliesRequestedStatus: $repliesRequestedStatus
          ){
              #{task_fragment}
            }
          }
      GQL
    end

    let(:projects_summary_query) do
      <<~GQL
        query tasksByQuarter($processId: ID!) {
          tasksByQuarter(processId: $processId)
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
        submittedBy {
          id
          name
        }
      GQL
    end

    let(:task_fields_fragment) do
      <<~GQL
        id
        body
        dueDate
        progress
        subTasksCount
        taskCommentsCount
        taskCommentReply
        order
        completed
        status
        attachments
        formUserId
        submittedBy {
          id
          name
        }
        assignees {
          id
          name
          imageUrl
          avatarUrl
        }
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

    let(:project_open_tasks_query) do
      %(query($taskId: ID!) {
        projectOpenTasks(taskId: $taskId) {
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

    let(:client_assigned_projects_query) do
      %(query GetClientAssignedProjects($offset: Int, $limit: Int) {
        clientAssignedProjects(offset: $offset, limit: $limit) {
          #{task_fields_fragment}
          subTasks {
              #{task_fields_fragment}
          }
        }
      })
    end

    let(:task_count) do
      %(query {
        myTasksCount
        })
    end

    describe 'Notes' do
      it 'should retrieve list of notes' do
        result = DoubleGdpSchema.execute(notes_query, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('data', 'allNotes').length).to eql 2
        expect(result.dig('data', 'allNotes', 0, 'user', 'id')).to eql admin.id
        expect(result.dig('data', 'allNotes', 0, 'userId')).to eql admin.id
      end

      it 'should raise an error when the current user is null' do
        result = DoubleGdpSchema.execute(notes_query, context: {
                                           site_community: community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message'))
          .to include('Unauthorized')
      end

      it 'should retrieve note comments with site manager as current user' do
        result = DoubleGdpSchema.execute(note_comments_query, context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }, variables: { taskId: first_note.id }).as_json

        expect(result.dig('data', 'taskComments')).not_to be_empty
      end

      it 'should retrieve note by id with site worker as current user' do
        result = DoubleGdpSchema.execute(note_query, context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('data', 'task')).not_to be_empty
      end

      it 'should retrieve list of flagged notes' do
        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('data', 'flaggedNotes').length).to eql 2
      end

      it 'returns empty array if no flagged notes exits' do
        community.notes.where(flagged: true).destroy_all
        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }).as_json

        expect(result['errors']).to be_nil
        expect(result.dig('data', 'flaggedNotes').length).to eql 0
      end
    end

    describe 'Tasks' do
      let!(:admin_task) do
        admin.tasks.create!(
          body: 'This is an assigned task',
          user_id: site_worker.id,
          author_id: admin.id,
          flagged: true,
          community_id: community.id,
          due_date: 2.days.from_now,
          completed: false,
          category: 'to_do',
        )
      end

      let(:user_notes_query) do
        %(query($id: ID!) {
              userNotes(id: $id) {
                body
                createdAt
                id
              }
          })
      end

      let(:tasks_stats_query) do
        %(query {
            taskStats {
              completedTasks
              tasksOpenAndOverdue
              overdueTasks
              tasksWithNoDueDate
              myOpenTasks
            }
          }
        )
      end

      let(:task_histories_query) do
        %(query {
          taskHistories(taskId: "#{first_note.id}") {
            id
            attrChanged
            initialValue
            updatedValue
            action
            noteEntityType
            createdAt
            user {
              id
              name
              imageUrl
            }
          }
        }
      )
      end

      it 'should search all to-dos by user\'s name' do
        admin.tasks.create!(
          body: "Note created for #{searchable_user.name}",
          user_id: searchable_user.id,
          author_id: admin.id,
          flagged: true,
          community_id: community.id,
          due_date: 10.days.from_now,
          completed: false,
          category: 'call',
        )

        variables = {
          query: "user: 'Henry'",
        }

        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }, variables: variables).as_json

        expect(result.dig('data', 'flaggedNotes')).not_to be_nil
        expect(result.dig('data', 'flaggedNotes').length).to eql 1

        filtered_note = Notes::Note.search_user("user: 'Henry'").first
        expect(filtered_note.user).to eq searchable_user
      end

      it 'should search all to-dos by assignees' do
        variables = {
          query: "assignees: #{admin.name}",
        }

        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }, variables: variables).as_json

        filtered_note = result.dig('data', 'flaggedNotes').select { |n| n['id'] == admin_task.id }

        expect(filtered_note.length).to eql 1
      end

      it 'should query notes for the user' do
        result = DoubleGdpSchema.execute(user_notes_query, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }, variables: { id: admin.id }).as_json

        expect(result.dig('data', 'userNotes')).not_to be_nil
        expect(result.dig('data', 'userNotes').length).to eql 2
      end

      describe 'Get tasks by role' do
        let(:form) do
          create(:form, name: 'DRC Project Review Process V3', community: community)
        end

        let(:form_user) { create(:form_user, form: form, user: admin, status_updated_by: admin) }

        it 'retrieves tasks by role for non admins and custodians' do
          result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                             current_user: developer,
                                             site_community: developer.community,
                                           }, variables: { id: admin.id }).as_json

          expect(result.dig('data', 'flaggedNotes')).not_to be_nil
          expect(result.dig('data', 'flaggedNotes').length).to eql 0
        end

        it 'retrieves assigned and created tasks for non admin roles' do
          developer.notes.create!(
            body: 'Developer task',
            user_id: developer.id,
            description: 'Developer created task',
            category: 'form',
            flagged: true,
            community_id: developer.community_id,
            author_id: developer.id,
          )

          # Assign task
          developer.tasks.create!(
            body: 'Developer assigned task',
            user_id: developer.id,
            description: 'Developer assigned task',
            category: 'form',
            flagged: true,
            community_id: developer.community_id,
            author_id: developer.id,
          )

          result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                             current_user: developer,
                                             site_community: developer.community,
                                           }, variables: { id: admin.id }).as_json

          expect(result.dig('data', 'flaggedNotes')).not_to be_nil
          expect(result.dig('data', 'flaggedNotes').length).to eql 2
        end

        it 'gets project for a client assigned task' do
          level1_parent = admin.notes.create!(
            body: 'Top level parent',
            description: 'Top level parent',
            user_id: site_worker.id,
            category: 'form',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            completed: false,
            form_user_id: form_user.id,
          )

          fourth_note.update(parent_note_id: level1_parent.id)
          third_note.update(form_user_id: form_user.id)
          developer.tasks.create!(
            body: 'Developer assigned task',
            user_id: developer.id,
            description: 'Developer assigned sub task',
            category: 'to_do',
            flagged: true,
            community_id: developer.community_id,
            author_id: developer.id,
            parent_note_id: third_note.id,
          )

          developer.tasks.create!(
            body: 'Developer assigned sub subtask',
            user_id: developer.id,
            description: 'Developer assigned sub subtask',
            category: 'to_do',
            flagged: true,
            community_id: developer.community_id,
            author_id: developer.id,
            parent_note_id: fourth_note.id,
          )

          result = DoubleGdpSchema.execute(client_assigned_projects_query, context: {
                                             current_user: developer,
                                             site_community: developer.community,
                                           }, variables: { id: admin.id }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'clientAssignedProjects').length).to eql 2
          parent_ids = result.dig('data', 'clientAssignedProjects').map { |task| task['id'] }
          expect(parent_ids).to contain_exactly(level1_parent.id, third_note.id)
        end
      end

      it 'should query tasks stats' do
        admin.notes.create!(
          body: 'Task for stats',
          description: 'Task for stats',
          user_id: site_worker.id,
          category: 'to_do',
          flagged: true,
          community_id: community.id,
          author_id: admin.id,
          due_date: 5.days.ago,
          completed: false,
        )

        admin.notes.create!(
          body: 'Other task for stats',
          description: 'Other task for stats',
          user_id: site_worker.id,
          category: 'to_do',
          flagged: true,
          community_id: community.id,
          author_id: admin.id,
          due_date: 1.day.ago,
          completed: false,
        )

        result = DoubleGdpSchema.execute(tasks_stats_query, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }).as_json

        expect(result.dig('data', 'taskStats')).not_to be_nil
        expect(result.dig('data', 'taskStats', 'completedTasks')).to eql 0
        expect(result.dig('data', 'taskStats', 'tasksOpenAndOverdue')).to eql 2
        expect(result.dig('data', 'taskStats', 'overdueTasks')).to eql 2
        expect(result.dig('data', 'taskStats', 'tasksWithNoDueDate')).to eql 1
      end

      it 'should query task histories' do
        first_note.note_histories.create!(
          note_id: first_note.id,
          user_id: admin.id,
          attr_changed: 'description',
          initial_value: 'initial description',
          updated_value: 'updated description',
          action: 'update',
          note_entity_type: 'Notes::Note',
          note_entity_id: first_note.id,
        )

        result = DoubleGdpSchema.execute(task_histories_query, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }).as_json

        expect(result['errors']).to be_nil

        history_data = result.dig('data', 'taskHistories')
        expect(history_data.length).not_to eq 0

        update_history = history_data.select do |h|
          h['initialValue'] == 'initial description' && h['noteEntityType'] == 'Notes::Note'
        end

        expect(update_history.length).not_to eq 0
        expect(update_history[0]['action']).to eq 'update'
        expect(update_history[0].dig('user', 'id')).to eq admin.id
      end

      it 'should query task comments' do
        result = DoubleGdpSchema.execute(note_comments_query, context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }, variables: { taskId: first_note.id }).as_json

        expect(result['errors']).to be_nil

        task_comments = result.dig('data', 'taskComments')
        expect(task_comments.length).not_to eq 0

        task_comment = task_comments.select { |h| h['body'] == 'Test note comment' }

        expect(task_comment.length).not_to eq 0
        expect(task_comment[0]['createdAt']).not_to be_nil
        expect(task_comment[0].dig('user', 'id')).to eq site_worker.id
      end

      it 'queries individual task' do
        result = DoubleGdpSchema.execute(note_query, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }).as_json

        expect(result['errors']).to be_nil
        expect(result.dig('data', 'task')).not_to be_nil
        expect(result.dig('data', 'task', 'id')).to eql third_note.id
      end

      it 'queries uncompleted tasks count' do
        result = DoubleGdpSchema.execute(task_count, context: {
                                           current_user: admin,
                                           site_community: community,
                                         }).as_json

        expect(result['errors']).to be_nil
        expect(result.dig('data', 'myTasksCount')).not_to be_nil
        expect(result.dig('data', 'myTasksCount')).to eql 1
      end

      it 'should retrieve list of flagged notes without due date' do
        variables = { query: 'due_date:nil' }
        result = DoubleGdpSchema.execute(flagged_notes_query,
                                         variables: variables,
                                         context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'flaggedNotes').length).to eql 1
      end

      it 'should raise unauthorised error when current user is nil' do
        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: nil,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message'))
          .to include('Unauthorized')
      end

      context 'sub tasks' do
        let!(:first_sub_task) do
          admin.notes.create!(
            body: 'Subtask body',
            description: 'Subtask 1',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
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
            community_id: community.id,
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
            community_id: community.id,
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
            community_id: community.id,
            author_id: site_worker.id,
            due_date: Time.zone.today,
            parent_note_id: third_sub_task.id,
          )
        end

        it 'retrieves parent tasks' do
          result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           }).as_json

          expect(result.dig('data', 'flaggedNotes').length).to eql 2
          expect(result.dig('data', 'flaggedNotes')
                       .select { |task| task['subTasks'].present? }.size).to eq(2)
        end

        it 'retrieves nested sub tasks up to 3 levels deep' do
          result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           }).as_json

          parent_task = result.dig('data', 'flaggedNotes')
                              .find { |task| task['description'] == 'Test parent task 1' }
          expect(parent_task).not_to be_nil
          expect(
            parent_task['subTasks'][0]['subTasks'][0]['subTasks'][0]['description'],
          ).to eq('Subtask 4')
        end

        it 'should retrieve sub tasks of a parent note' do
          admin.notes.create!(
            body: 'Subtask body',
            description: 'Subtask 1',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            due_date: Time.zone.today,
            parent_note_id: third_note.id,
          )

          variables = {
            taskId: third_note.id,
          }
          result = DoubleGdpSchema.execute(note_sub_tasks_query, context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           }, variables: variables).as_json
          expect(result.dig('data', 'taskSubTasks')).not_to be_empty
          expect(result.dig('data', 'taskSubTasks', 0, 'parentNote', 'id')).to eq third_note.id
        end

        it 'should raise unauthorised error/
          for retrieve comments when current user is nil' do
          variables = {
            taskId: third_note.id,
          }
          result = DoubleGdpSchema.execute(note_sub_tasks_query, context: {
                                             current_user: nil,
                                             site_community: community,
                                           }, variables: variables).as_json
          expect(result.dig('errors', 0, 'message'))
            .to include('Unauthorized')
        end
      end

      describe 'Task Lists' do
        let(:process) { create(:process, community: community) }
        let(:task_lists_query) do
          <<~GQL
            query TaskLists {
              taskLists {
                #{task_fields_fragment}
              }
            }
          GQL
        end

        it 'throws an error of user has no permissions' do
          result = DoubleGdpSchema.execute(task_lists_query, context: {
                                             current_user: developer,
                                             site_community: developer.community,
                                           }).as_json

          expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
        end

        it 'returns empty array if no task lists exist' do
          result = DoubleGdpSchema.execute(task_lists_query, context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'taskLists').length).to eql 0
        end

        it 'retrieves task lists' do
          note_list = create(:note_list, community: community, process: process)
          parent_task_list = admin.notes.create!(
            body: 'Parent Note List',
            description: 'Test parent note list',
            user_id: admin.id,
            category: 'task_list',
            flagged: true,
            community_id: community.id,
            note_list_id: note_list.id,
            author_id: admin.id,
            completed: false,
          )
          result = DoubleGdpSchema.execute(task_lists_query, context: {
                                             current_user: admin,
                                             site_community: community,
                                           }).as_json

          expect(result.dig('data', 'taskLists').length).to eql 1
          expect(result.dig('data', 'taskLists', 0, 'body')).to eq(parent_task_list.body)
        end
      end
    end

    describe 'Processes' do
      it 'should retrieve list of processes' do
        result = DoubleGdpSchema.execute(processes_query, context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('data', 'processes').length).to eql 1
      end

      it 'should retrieve list of processes without due date' do
        variables = { query: 'due_date:nil' }
        result = DoubleGdpSchema.execute(processes_query,
                                         variables: variables,
                                         context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'processes').length).to eql 1
      end

      it 'should raise unauthorised error when current user is nil' do
        result = DoubleGdpSchema.execute(processes_query, context: {
                                           current_user: nil,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message'))
          .to include('Unauthorized')
      end
    end

    describe '#projects' do
      let(:form) do
        create(:form, name: 'DRC Project Review Process V3', community: community)
      end

      let(:process) do
        create(:process,
               process_type: 'drc',
               name: 'DRC',
               form_id: form.id,
               community: community)
      end

      let(:another_form) do
        create(:form, name: 'DRC Project Review Process V2', community: community)
      end

      let(:form_user) { create(:form_user, form: form, user: admin, status_updated_by: admin) }

      let(:another_form_user) do
        create(:form_user, form: form, user: admin, status_updated_by: admin)
      end

      let(:project_comments_query) do
        %(query($taskId: ID!) {
          projectComments(taskId: $taskId) {
            id
            body
            userId
            createdAt
            user {
              id
              name
              imageUrl
            }
          }
        })
      end

      let(:process_comments_stats_query) do
        %(query($processId: ID!) {
          replyCommentStats(processId: $processId) {
            sent
            received
            resolved
          }
        })
      end

      let(:replies_requested_comments_query) do
        %(query($taskId: ID!) {
          repliesRequestedComments(taskId: $taskId) {
            sent {
              id
              body
            }
            received {
              id
              body
            }
            resolved {
              id
              body
            }
            others {
              id
              body
            }
          }
        })
      end

      let(:project_query) do
        <<~GQL
          query Project($formUserId: ID!) {
            project(formUserId: $formUserId) {
              id
              body
            }
          }
        GQL
      end

      context 'when projects are fetched' do
        before do
          form
          process
          another_form
          form_user
          another_form_user
          first_note.update(form_user_id: form_user.id, completed: true)
          second_note.update(form_user_id: another_form_user.id)
        end

        it 'throws an error if process is not found' do
          variables = { processId: 'Non existing process' }
          result = DoubleGdpSchema.execute(projects_query, variables: variables,
                                                           context: {
                                                             current_user: site_worker,
                                                             site_community: community,
                                                           }).as_json
          expect(result['errors']).not_to be_nil
          expect(result.dig('errors', 0, 'message')).to include('not found')
        end

        it 'returns the projects for DRC' do
          variables = { processId: process.id }
          result = DoubleGdpSchema.execute(projects_query, variables: variables,
                                                           context: {
                                                             current_user: site_worker,
                                                             site_community: community,
                                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projects').length).to eql 2
          expect(result.dig('data', 'projects', 0, 'submittedBy', 'id')).to eql admin.id
        end

        it 'gets a project by form_user_id' do
          third_note.update(form_user_id: form_user.id)
          result = DoubleGdpSchema.execute(project_query,
                                           context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           },
                                           variables: {
                                             formUserId: third_note.form_user_id,
                                           }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'project', 'body')).to eq(third_note.body)
        end

        it 'raises an error if project is not found' do
          result = DoubleGdpSchema.execute(project_query,
                                           context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           },
                                           variables: {
                                             formUserId: second_note.form_user_id,
                                           }).as_json

          expect(result['errors']).not_to be_nil
          expect(result['errors'][0]['message']).to include('not found')
        end

        it 'retrieves project comments' do
          create(
            :note_comment,
            note: third_note,
            body: 'Step 1',
            user: site_worker,
            status: 'active',
            reply_required: true,
          )

          subtask1 = admin.notes.create!(
            body: 'Step 1 subtask 1',
            description: 'Step 1 subtask 1',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask1,
            body: 'Step 1 subtask 1 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
          )

          subtask2 = admin.notes.create!(
            body: 'Step 1 subtask 2',
            description: 'Step 1 subtask 2',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: subtask1.id,
          )

          create(
            :note_comment,
            note: subtask2,
            body: 'Step 1 subtask 2 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
          )

          result = DoubleGdpSchema.execute(project_comments_query, context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           }, variables: { taskId: third_note.id }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projectComments').length).to eq 3
        end

        it 'retrieves tagged comments for developers requested for reply' do
          create(
            :note_comment,
            note: third_note,
            body: 'Comment needs reply from developer',
            user: developer,
            status: 'active',
            reply_required: true,
            reply_from: developer,
          )

          subtask1 = admin.notes.create!(
            body: 'Step 1 subtask 1',
            description: 'Step 1 subtask 1',
            user_id: developer.id,
            category: 'other',
            flagged: true,
            community_id: developer.community_id,
            author_id: developer.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask1,
            body: 'Step 1 subtask 1 comment needs reply from developer',
            user: developer,
            status: 'active',
            reply_required: true,
            reply_from: developer,
          )

          result = DoubleGdpSchema.execute(project_comments_query, context: {
                                             current_user: developer,
                                             site_community: developer.community,
                                           }, variables: { taskId: third_note.id }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projectComments').length).to eq 2
        end

        it 'retrieves no tagged comments for developers requested for reply' do
          create(
            :note_comment,
            note: third_note,
            body: 'Comment needs reply from developer',
            user: developer,
            status: 'active',
            reply_required: true,
            reply_from: site_worker,
          )

          result = DoubleGdpSchema.execute(project_comments_query, context: {
                                             current_user: developer,
                                             site_community: developer.community,
                                           }, variables: { taskId: third_note.id }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projectComments').length).to eq 0
        end

        it 'retrieves tagged comments for consultant assigned task requested for reply' do
          create(
            :note_comment,
            note: third_note,
            body: 'Comment needs reply from consultant',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: consultant,
          )

          subtask1 = admin.notes.create!(
            body: 'Step 1 subtask 1',
            description: 'Step 1 subtask 1',
            user_id: admin.id,
            category: 'other',
            flagged: true,
            community_id: consultant.community_id,
            author_id: admin.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask1,
            body: 'Step 1 subtask 1 comment needs reply from consultant',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: consultant,
          )

          consultant.tasks << third_note << subtask1

          result = DoubleGdpSchema.execute(project_comments_query, context: {
                                             current_user: consultant,
                                             site_community: consultant.community,
                                           }, variables: { taskId: third_note.id }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projectComments').length).to eq 2
        end

        it 'does not retrieve tagged comments for non consultant assigned task' do
          create(
            :note_comment,
            note: third_note,
            body: 'Comment needs reply from developer',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: developer,
          )

          developer.tasks << third_note

          result = DoubleGdpSchema.execute(project_comments_query, context: {
                                             current_user: consultant,
                                             site_community: consultant.community,
                                           }, variables: { taskId: third_note.id }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projectComments').length).to eq 0
        end
      end

      context 'when completed_per_quarter is in the arguments' do
        before do
          form
          another_form
          process
          form_user
          another_form_user
          first_note.update(form_user_id: form_user.id, completed: true)
          first_note.update(completed_at: Time.zone.local(Date.current.year, '02', '02'))

          second_note.update(form_user_id: another_form_user.id, completed: true)
          second_note.update(completed_at: Time.zone.local(Date.current.year, '05', '05'))
        end

        context 'when ytd is passed as an argument' do
          it 'returns the projects completed till now' do
            result = DoubleGdpSchema.execute(projects_query, context: {
                                               current_user: site_worker,
                                               site_community: community,
                                             }, variables: {
                                               processId: process.id,
                                               completedPerQuarter: 'ytd',
                                             }).as_json

            expect(result['errors']).to be_nil
            expect(result.dig('data', 'projects').length).to eql 2
          end
        end

        it 'returns the projects in the quarter supplied' do
          result = DoubleGdpSchema.execute(projects_query, context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           }, variables: {
                                             processId: process.id,
                                             completedPerQuarter: 'Q1',
                                           }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projects').length).to eql 1
          expect(result.dig('data', 'projects', 0, 'id')).to eql(first_note.id)
        end

        it 'throws an error if invalid quarter is supplied' do
          expect do
            DoubleGdpSchema.execute(projects_query, context: {
                                      current_user: site_worker,
                                      site_community: community,
                                    }, variables: {
                                      processId: process.id,
                                      completedPerQuarter: 'Q9',
                                    }).as_json
          end.to raise_error('Invalid argument. quarter should be either Q1, Q2, Q3 or Q4')
        end
      end

      context 'when submitted_per_quarter is in the arguments' do
        before do
          form
          another_form
          process
          form_user
          another_form_user
          first_note.update(form_user_id: form_user.id)
          first_note.update(created_at: Time.zone.local(Date.current.year, '02', '02'))

          second_note.update(form_user_id: another_form_user.id, completed: true)
          second_note.update(created_at: Time.zone.local(Date.current.year, '05', '05'))
        end

        context 'when ytd is passed as an argument' do
          it 'returns the projects submitted till now' do
            result = DoubleGdpSchema.execute(projects_query, context: {
                                               current_user: site_worker,
                                               site_community: community,
                                             }, variables: {
                                               processId: process.id,
                                               submittedPerQuarter: 'ytd',
                                             }).as_json

            expect(result['errors']).to be_nil
            expect(result.dig('data', 'projects').length).to eql 2
          end
        end

        it 'returns the projects in the quarter supplied' do
          result = DoubleGdpSchema.execute(projects_query, context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           }, variables: {
                                             processId: process.id,
                                             submittedPerQuarter: 'Q1',
                                           }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projects').length).to eql 1
          expect(result.dig('data', 'projects', 0, 'id')).to eql(first_note.id)
        end

        it 'throws an error if invalid quarter is supplied' do
          expect do
            DoubleGdpSchema.execute(projects_query, context: {
                                      current_user: site_worker,
                                      site_community: community,
                                    }, variables: {
                                      processId: process.id,
                                      submittedPerQuarter: 'Q9',
                                    }).as_json
          end.to raise_error('Invalid argument. quarter should be either Q1, Q2, Q3 or Q4')
        end
      end

      context 'when replies_requested_status is in the arguments' do
        before do
          form
          another_form
          process
          form_user
          another_form_user
          first_note.update(form_user_id: form_user.id)

          second_note.update(form_user_id: another_form_user.id, completed: true)

          create(
            :note_comment,
            note: first_note,
            body: 'Note 1 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            grouping_id: '5d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )
        end

        it 'returns the projects with the status supplied' do
          result = DoubleGdpSchema.execute(projects_query, context: {
                                             current_user: site_worker,
                                             site_community: community,
                                           }, variables: {
                                             processId: process.id,
                                             repliesRequestedStatus: 'sent',
                                           }).as_json

          expect(result.dig('data', 'projects', 0, 'id')).to eql(first_note.id)
        end
      end

      context 'when life_time_category is passed in argument' do
        before do
          form
          another_form
          process
          form_user
          another_form_user
          first_note.update(form_user_id: form_user.id)
          first_note.update(created_at: Time.zone.local(Date.current.year - 1, '02', '02'))

          second_note.update(form_user_id: another_form_user.id, completed: true)
          second_note.update(created_at: Time.zone.local(Date.current.year - 2, '05', '05'))
        end

        context 'when life time category is for submitted projects' do
          it 'returns lists of projects submitted till now' do
            result = DoubleGdpSchema.execute(projects_query, context: {
                                               current_user: site_worker,
                                               site_community: community,
                                             }, variables: {
                                               processId: process.id,
                                               lifeTimeCategory: 'submitted',
                                             }).as_json

            expect(result['errors']).to be_nil
            expect(result.dig('data', 'projects').length).to eql 2
          end
        end

        context 'when life time category is for completed projects' do
          it 'returns lists of projects completed till now' do
            result = DoubleGdpSchema.execute(projects_query, context: {
                                               current_user: site_worker,
                                               site_community: community,
                                             }, variables: {
                                               processId: process.id,
                                               lifeTimeCategory: 'completed',
                                             }).as_json

            expect(result['errors']).to be_nil
            expect(result.dig('data', 'projects').length).to eql 1
            expect(result.dig('data', 'projects', 0, 'id')).to eql second_note.id
          end
        end

        context 'when life time category is for outstanding projects' do
          it 'returns lists of projects outstanding till now' do
            result = DoubleGdpSchema.execute(projects_query, context: {
                                               current_user: site_worker,
                                               site_community: community,
                                             }, variables: {
                                               processId: process.id,
                                               lifeTimeCategory: 'outstanding',
                                             }).as_json

            expect(result['errors']).to be_nil
            expect(result.dig('data', 'projects').length).to eql 1
            expect(result.dig('data', 'projects', 0, 'id')).to eql first_note.id
          end
        end
      end

      context 'tasks_by_quarter' do
        before do
          form
          another_form
          process
          form_user
          another_form_user
          first_note.update(form_user_id: form_user.id)
          first_note.update(created_at: Time.zone.local(Date.current.year, '02', '02'))

          second_note.update(form_user_id: another_form_user.id, completed: true)
          second_note.update(created_at: Time.zone.local(Date.current.year, '05', '05'))
          second_note.update(completed_at: Time.zone.local(Date.current.year, '01', '01'))
        end

        it 'returns counts of the completed tasks per quarter' do
          variables = { processId: process.id }
          result = DoubleGdpSchema.execute(projects_summary_query, variables: variables,
                                                                   context: {
                                                                     current_user: site_worker,
                                                                     site_community: community,
                                                                   }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'tasksByQuarter', 'completed', 0)).to eql [2022.0, 1.0, 1]
          expect(
            result.dig('data', 'tasksByQuarter', 'submitted'),
          ).to include([2022.0, 1.0, 1], [2022.0, 2.0, 1])
        end

        it 'throws error if process is not found' do
          variables = { processId: 'A random process' }
          result = DoubleGdpSchema.execute(projects_summary_query, variables: variables,
                                                                   context: {
                                                                     current_user: site_worker,
                                                                     site_community: community,
                                                                   }).as_json

          expect(result['errors']).not_to be_nil
          expect(result.dig('errors', 0, 'message')).to include('not found')
        end
      end

      it 'should retrieve projectOpenTasks of a parent note' do
        admin.notes.create!(
          body: 'Subtask body',
          description: 'Subtask 1',
          user_id: site_worker.id,
          category: 'other',
          flagged: true,
          completed: false,
          community_id: community.id,
          author_id: site_worker.id,
          due_date: Time.zone.today,
          parent_note_id: third_note.id,
        )

        variables = {
          taskId: third_note.id,
        }
        result = DoubleGdpSchema.execute(project_open_tasks_query, context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }, variables: variables).as_json
        expect(result.dig('data', 'projectOpenTasks')).not_to be_empty
        expect(result.dig('data', 'projectOpenTasks', 0, 'parentNote', 'id')).to eq third_note.id
      end

      it 'should retrieve list of processes without due date' do
        variables = { query: 'due_date:nil' }
        result = DoubleGdpSchema.execute(processes_query,
                                         variables: variables,
                                         context: {
                                           current_user: site_worker,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'processes').length).to eql 1
      end

      context 'when current-user has can_get_comment_stats permission' do
        before do
          community
          site_worker
          third_note
          process
          third_note.update(form_user_id: form_user.id, completed: true)

          create(
            :note_comment,
            note: third_note,
            body: 'Step 1',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '6d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask1 = admin.notes.create!(
            body: 'Step 1 subtask 1',
            description: 'Step 1 subtask 1',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask1,
            body: 'Step 1 subtask 1 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '5d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask2 = admin.notes.create!(
            body: 'Step 1 subtask 2',
            description: 'Step 1 subtask 2',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: subtask1.id,
          )

          create(
            :note_comment,
            note: subtask2,
            body: 'Step 1 subtask 2 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '4d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )
          create(
            :note_comment,
            note: subtask2,
            body: 'Admin reply to Step 1 subtask 2 comment',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: site_worker,
            grouping_id: '4d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask3 = admin.notes.create!(
            body: 'Step 1 subtask 3',
            description: 'Step 1 subtask 3',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask3,
            body: 'Step 1 subtask 3 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '1d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
            replied_at: 2.days.ago,
          )
          create(
            :note_comment,
            note: subtask3,
            body: 'Step 1 subtask 3 comment',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: site_worker,
            grouping_id: '1d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
            replied_at: 1.day.ago,
          )
        end

        it 'retrieves process comments' do
          variables = { processId: process.id }
          result = DoubleGdpSchema.execute(
            process_comments_stats_query,
            variables: variables,
            context: {
              current_user: admin,
              site_community: community,
            },
          ).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'replyCommentStats', 'sent')).to eq 1
          expect(result.dig('data', 'replyCommentStats', 'received')).to eq 2
          expect(result.dig('data', 'replyCommentStats', 'resolved')).to eq 1
        end

        it 'raises error if process is not found' do
          variables = { processId: 'Non existent process' }
          result = DoubleGdpSchema.execute(
            process_comments_stats_query,
            variables: variables,
            context: {
              current_user: admin,
              site_community: community,
            },
          ).as_json

          expect(result.dig('errors', 0, 'message')).to include('not found')
        end

        it 'raises unauthorized user if current-user does not have access' do
          variables = { processId: process.id }
          result = DoubleGdpSchema.execute(
            process_comments_stats_query,
            variables: variables,
            context: {
              current_user: site_worker,
              site_community: community,
            },
          ).as_json

          expect(result.dig('errors', 0, 'message'))
            .to include('Unauthorized')
        end
      end

      describe 'Processes comments' do
        let(:process_reply_comments_query) do
          <<~GQL
            query processReplyComments($processId: ID!) {
              processReplyComments(processId: $processId) {
                sent {
                  id
                  body
                  createdAt
                  replyFrom {
                    id
                    name
                  }
                }
                received {
                  id
                  body
                  repliedAt
                }
                resolved {
                  id
                  body
                }
              }
            }
          GQL
        end

        before do
          community
          site_worker
          third_note
          process
          third_note.update(form_user_id: form_user.id, completed: true)
        end

        it 'raises error when user has no permissions' do
          variables = { processId: process.id }
          result = DoubleGdpSchema.execute(
            process_reply_comments_query,
            variables: variables,
            context: {
              current_user: site_worker,
              site_community: community,
            },
          ).as_json

          expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
        end

        it 'raises error if process is not found' do
          variables = { processId: 'Non existent process' }
          result = DoubleGdpSchema.execute(
            process_reply_comments_query,
            variables: variables,
            context: {
              current_user: admin,
              site_community: admin.community,
            },
          ).as_json

          expect(result.dig('errors', 0, 'message')).to include('not found')
        end

        it 'returns process comments by status' do
          create(
            :note_comment,
            note: third_note,
            body: 'Step 1',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '6d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask1 = admin.notes.create!(
            body: 'Step 1 subtask 1',
            description: 'Step 1 subtask 1',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask1,
            body: 'Step 1 subtask 1 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '5d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask2 = admin.notes.create!(
            body: 'Step 1 subtask 2',
            description: 'Step 1 subtask 2',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: subtask1.id,
          )

          create(
            :note_comment,
            note: subtask2,
            body: 'Step 1 subtask 2 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '4d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          create(
            :note_comment,
            note: subtask2,
            body: 'Admin reply to Step 1 subtask 2 comment',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: site_worker,
            grouping_id: '4d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask3 = admin.notes.create!(
            body: 'Step 1 subtask 3',
            description: 'Step 1 subtask 3',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask3,
            body: 'Step 1 subtask 3 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '1d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
            replied_at: 2.days.ago,
          )
          create(
            :note_comment,
            note: subtask3,
            body: 'Step 1 subtask 3 comment',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: site_worker,
            grouping_id: '1d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
            replied_at: 1.day.ago,
          )

          variables = { processId: process.id }
          result = DoubleGdpSchema.execute(
            process_reply_comments_query,
            variables: variables,
            context: {
              current_user: admin,
              site_community: admin.community,
            },
          ).as_json

          expect(result.dig('data', 'processReplyComments', 'sent').size).to eq 1
          expect(
            result.dig('data', 'processReplyComments', 'sent', 0, 'body'),
          ).to eq 'Admin reply to Step 1 subtask 2 comment'
          expect(
            result.dig('data', 'processReplyComments', 'received').size,
          ).to eq 2
          expect(
            result.dig('data', 'processReplyComments', 'received', 0, 'body'),
          )
            .to eq 'Step 1 subtask 1 comment'
          expect(result.dig('data', 'processReplyComments', 'resolved').size).to eq 1
          expect(
            result.dig('data', 'processReplyComments', 'resolved', 0, 'body'),
          ).to eq 'Step 1 subtask 3 comment'
        end
      end

      describe 'replies_requested_comments' do
        before do
          community
          site_worker
          third_note

          create(
            :note_comment,
            note: third_note,
            body: 'Step 1',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '6d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask1 = admin.notes.create!(
            body: 'Step 1 subtask 1',
            description: 'Step 1 subtask 1',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask1,
            body: 'Step 1 subtask 1 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '5d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask2 = admin.notes.create!(
            body: 'Step 1 subtask 2',
            description: 'Step 1 subtask 2',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: subtask1.id,
          )

          create(
            :note_comment,
            note: subtask2,
            body: 'Step 1 subtask 2 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '4d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )
          create(
            :note_comment,
            note: subtask2,
            body: 'Admin reply to Step 1 subtask 2 comment',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: site_worker,
            grouping_id: '4d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
          )

          subtask3 = admin.notes.create!(
            body: 'Step 1 subtask 3',
            description: 'Step 1 subtask 3',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: community.id,
            author_id: site_worker.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask3,
            body: 'Step 1 subtask 3 comment',
            user: site_worker,
            status: 'active',
            reply_required: true,
            reply_from: admin,
            grouping_id: '1d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
            replied_at: 2.days.ago,
          )
          create(
            :note_comment,
            note: subtask3,
            body: 'Step 1 subtask 3 comment',
            user: admin,
            status: 'active',
            reply_required: true,
            reply_from: site_worker,
            grouping_id: '1d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
            replied_at: 1.day.ago,
          )
        end

        context 'when current-user has can_get_replies_requested_comments permission' do
          it 'retrieves replies requested comments according to statuses' do
            result = DoubleGdpSchema.execute(replies_requested_comments_query, context: {
                                               current_user: admin,
                                               site_community: community,
                                             }, variables: { taskId: third_note.id }).as_json

            expect(result['errors']).to be_nil
            expect(result.dig('data', 'repliesRequestedComments', 'sent', 0, 'body')).to eq(
              'Admin reply to Step 1 subtask 2 comment',
            )
            expect(result.dig('data', 'repliesRequestedComments', 'received', 0, 'body')).to eq(
              'Step 1 subtask 1 comment',
            )
            expect(result.dig('data', 'repliesRequestedComments', 'resolved', 0, 'body')).to eq(
              'Step 1 subtask 3 comment',
            )
            expect(result.dig('data', 'repliesRequestedComments', 'others').length).to eq(0)
          end
        end

        context 'when current-user does not have permission' do
          it 'raises unauthorized error' do
            result = DoubleGdpSchema.execute(replies_requested_comments_query, context: {
                                               current_user: site_worker,
                                               site_community: community,
                                             }, variables: { taskId: third_note.id }).as_json

            expect(result.dig('errors', 0, 'message'))
              .to include('Unauthorized')
          end
        end
      end
    end

    describe '#project stages' do
      let(:process) { create(:process, community: community) }
      let(:note_list) { create(:note_list, process: process, community: community) }

      let(:project_stages_query) do
        <<~GQL
          query projectStages($processId: ID!) {
            projectStages(processId: $processId)
            {
              id
              body
            }
          }
        GQL
      end

      it 'raises an error if note list is not found' do
        variables = { processId: process.id }
        result = DoubleGdpSchema.execute(project_stages_query, variables: variables,
                                                               context: {
                                                                 current_user: admin,
                                                                 site_community: community,
                                                               }).as_json

        expect(result.dig('errors', 0, 'message')).to include('not found')
      end

      it 'raises error if parent task is not found' do
        note_list
        variables = { processId: process.id }
        result = DoubleGdpSchema.execute(project_stages_query, variables: variables,
                                                               context: {
                                                                 current_user: admin,
                                                                 site_community: community,
                                                               }).as_json

        expect(result.dig('errors', 0, 'message')).to include('not found')
      end

      it 'returns project steps for the process' do
        parent_task = admin.notes.create!(
          body: 'Parent task for task list',
          description: 'Parent task for task list',
          user_id: admin.id,
          category: 'task_list',
          flagged: true,
          community_id: community.id,
          author_id: admin.id,
          parent_note_id: nil,
          note_list_id: note_list.id,
        )

        admin.notes.create!(
          body: 'Step 1',
          description: 'Step 1',
          user_id: admin.id,
          category: 'to_do',
          order: 1,
          flagged: true,
          community_id: community.id,
          author_id: admin.id,
          parent_note_id: parent_task.id,
          note_list_id: note_list.id,
        )

        admin.notes.create!(
          body: 'Step 2',
          description: 'Step 2',
          user_id: admin.id,
          category: 'to_do',
          order: 2,
          flagged: true,
          community_id: community.id,
          author_id: admin.id,
          parent_note_id: parent_task.id,
          note_list_id: note_list.id,
        )

        variables = { processId: process.id }
        result = DoubleGdpSchema.execute(project_stages_query, variables: variables,
                                                               context: {
                                                                 current_user: admin,
                                                                 site_community: community,
                                                               }).as_json

        expect(result['errors']).to be_nil
        expect(result.dig('data', 'projectStages').size).to eq(2)
        expect(result.dig('data', 'projectStages', 0, 'body')).to eq('Step 1')
      end
    end

    describe '#document_comments' do
      let(:process) { create(:process, community: community) }
      let(:note_list) { create(:note_list, process: process, community: community) }

      let(:document_comments_query) do
        <<~GQL
          query documentComments($taggedDocumentId: ID!) {
            documentComments(taggedDocumentId: $taggedDocumentId)
            {
              id
              body
            }
          }
        GQL
      end

      it 'raises an error if user is not authorized' do
        variables = { taggedDocumentId: '10bbb9ba-0123-3344-c56d-b16e532c8cd0' }
        result = DoubleGdpSchema.execute(document_comments_query, variables: variables,
                                                                  context: {
                                                                    current_user: developer,
                                                                    site_community: community,
                                                                  }).as_json

        expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      end

      it 'returns comments for a tagged document' do
        note = admin.notes.create!(
          body: 'Parent task for task list',
          description: 'Parent task for task list',
          user_id: admin.id,
          category: 'to_do',
          flagged: true,
          community_id: community.id,
          author_id: admin.id,
          parent_note_id: nil,
          note_list_id: note_list.id,
        )

        note.note_comments.create!(
          body: 'a comment with a tagged document',
          status: 'active',
          user_id: admin.id,
          tagged_documents: ['10bbb9ba-0123-3344-c56d-b16e532c8cd0'],
        )

        note.note_comments.create!(
          body: 'another comment with a tagged document',
          status: 'active',
          user_id: admin.id,
          tagged_documents: ['0091a9ba-0123-3344-c56d-b16e532c8cd0'],
        )

        variables = { taggedDocumentId: '10bbb9ba-0123-3344-c56d-b16e532c8cd0' }
        result = DoubleGdpSchema.execute(document_comments_query, variables: variables,
                                                                  context: {
                                                                    current_user: admin,
                                                                    site_community: community,
                                                                  }).as_json

        expect(result['errors']).to be_nil
        expect(result.dig('data', 'documentComments').size).to eq(1)
        expect(result.dig('data', 'documentComments', 0, 'body')).to eq(
          'a comment with a tagged document',
        )
      end
    end
  end
end

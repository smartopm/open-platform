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
    let(:site_worker) { create(:site_worker, role: site_worker_role) }
    let!(:admin) { create(:admin_user, role: admin_role, community: site_worker.community) }
    let(:searchable_user) { create(:user, name: 'Henry Tim', community_id: admin.community_id) }

    let!(:first_note) do
      admin.notes.create!(
        body: 'Note body 1',
        user_id: site_worker.id,
        description: 'Test task 1',
        category: 'emergency',
        community_id: site_worker.community_id,
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
        community_id: site_worker.community_id,
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
        community_id: site_worker.community_id,
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
        community_id: site_worker.community_id,
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
        query GetProjects($offset: Int, $limit: Int, $step: String, $quarter: String) {
          projects(offset: $offset, limit: $limit, step: $step, quarter: $quarter) {
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

    let(:task_fields_fragment) do
      <<~GQL
        id
        body
        dueDate
        progress
        subTasksCount
        taskCommentsCount
        documents
        formUserId
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

      it 'should retrieve note comments with site manager as current user' do
        result = DoubleGdpSchema.execute(note_comments_query, context: {
                                           current_user: site_worker,
                                           site_community: site_worker.community,
                                         }, variables: { taskId: first_note.id }).as_json

        expect(result.dig('data', 'taskComments')).not_to be_empty
      end

      it 'should retrieve note by id with site worker as current user' do
        result = DoubleGdpSchema.execute(note_query, context: {
                                           current_user: site_worker,
                                           site_community: site_worker.community,
                                         }).as_json
        expect(result.dig('data', 'task')).not_to be_empty
      end

      it 'should retrieve list of flagged notes' do
        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: site_worker,
                                           site_community: site_worker.community,
                                         }).as_json
        expect(result.dig('data', 'flaggedNotes').length).to eql 2
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
    end

    describe 'Tasks' do
      let!(:admin_task) do
        admin.tasks.create!(
          body: 'This is an assigned task',
          user_id: site_worker.id,
          author_id: admin.id,
          flagged: true,
          community_id: admin.community_id,
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
          community_id: admin.community_id,
          due_date: 10.days.from_now,
          completed: false,
          category: 'call',
        )

        variables = {
          query: "user: 'Henry'",
        }

        result = DoubleGdpSchema.execute(flagged_notes_query, context: {
                                           current_user: admin,
                                           site_community: admin.community,
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
                                           site_community: admin.community,
                                         }, variables: variables).as_json

        filtered_note = result.dig('data', 'flaggedNotes').select { |n| n['id'] == admin_task.id }

        expect(filtered_note.length).to eql 1
      end

      it 'should query notes for the user' do
        result = DoubleGdpSchema.execute(user_notes_query, context: {
                                           current_user: admin,
                                           site_community: site_worker.community,
                                         }, variables: { id: admin.id }).as_json

        expect(result.dig('data', 'userNotes')).not_to be_nil
        expect(result.dig('data', 'userNotes').length).to eql 2
      end

      describe 'Get tasks by role' do
        let(:developer_role) { create(:role, name: 'developer', community: admin.community) }
        let(:developer) { create(:developer, role: developer_role, community: admin.community) }
        let!(:developer_permissions) do
          create(:permission, module: 'note',
                              role: developer_role,
                              permissions: %w[can_fetch_flagged_notes])
        end

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
            community_id: site_worker.community_id,
            author_id: site_worker.id,
            completed: false,
          )

          fourth_note.update(parent_note_id: level1_parent.id)

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
          community_id: site_worker.community_id,
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
          community_id: site_worker.community_id,
          author_id: admin.id,
          due_date: 1.day.ago,
          completed: false,
        )

        result = DoubleGdpSchema.execute(tasks_stats_query, context: {
                                           current_user: admin,
                                           site_community: site_worker.community,
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
                                           site_community: admin.community,
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
                                           site_community: site_worker.community,
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
                                           site_community: site_worker.community,
                                         }).as_json

        expect(result['errors']).to be_nil
        expect(result.dig('data', 'task')).not_to be_nil
        expect(result.dig('data', 'task', 'id')).to eql third_note.id
      end

      it 'queries uncompleted tasks count' do
        result = DoubleGdpSchema.execute(task_count, context: {
                                           current_user: admin,
                                           site_community: site_worker.community,
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

        it 'should raise unauthorised error/
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
      end
    end

    describe 'Processes' do
      it 'should retrieve list of processes' do
        result = DoubleGdpSchema.execute(processes_query, context: {
                                           current_user: site_worker,
                                           site_community: site_worker.community,
                                         }).as_json
        expect(result.dig('data', 'processes').length).to eql 1
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
    end

    describe '#projects' do
      let(:form) do
        create(:form, name: 'DRC Project Review Process V3', community: site_worker.community)
      end

      let(:another_form) do
        create(:form, name: 'DRC Project Review Process V2', community: site_worker.community)
      end

      let(:form_user) { create(:form_user, form: form, user: admin, status_updated_by: admin) }

      let(:another_form_user) do
        create(:form_user, form: another_form, user: admin, status_updated_by: admin)
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

      context 'when projects are fetched' do
        before do
          form
          another_form
          form_user
          another_form_user
          first_note.update(form_user_id: form_user.id)
          second_note.update(form_user_id: another_form_user.id)
        end

        it 'returns the projects for DRC' do
          result = DoubleGdpSchema.execute(projects_query, context: {
                                             current_user: site_worker,
                                             site_community: site_worker.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projects').length).to eql 2
        end

        it 'retrieves project comments' do
          create(
            :note_comment,
            note: third_note,
            body: 'Step 1',
            user: site_worker,
            status: 'active',
          )

          subtask1 = admin.notes.create!(
            body: 'Step 1 subtask 1',
            description: 'Step 1 subtask 1',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: site_worker.community_id,
            author_id: site_worker.id,
            parent_note_id: third_note.id,
          )

          create(
            :note_comment,
            note: subtask1,
            body: 'Step 1 subtask 1 comment',
            user: site_worker,
            status: 'active',
          )

          subtask2 = admin.notes.create!(
            body: 'Step 1 subtask 2',
            description: 'Step 1 subtask 2',
            user_id: site_worker.id,
            category: 'other',
            flagged: true,
            community_id: site_worker.community_id,
            author_id: site_worker.id,
            parent_note_id: subtask1.id,
          )

          create(
            :note_comment,
            note: subtask2,
            body: 'Step 1 subtask 2 comment',
            user: site_worker,
            status: 'active',
          )

          result = DoubleGdpSchema.execute(project_comments_query, context: {
                                             current_user: site_worker,
                                             site_community: site_worker.community,
                                           }, variables: { taskId: third_note.id }).as_json

          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projectComments').length).to eq 3
        end
      end

      context 'when quarter is in the arguments' do
        before do
          form
          another_form
          form_user
          another_form_user
          first_note.update(form_user_id: form_user.id, completed: true)
          first_note.update(completed_at: Time.zone.local(Date.current.year, '02', '02'))

          second_note.update(form_user_id: another_form_user.id, completed: true)
          second_note.update(completed_at: Time.zone.local(Date.current.year, '05', '05'))
        end

        it 'returns the projects in the quarter supplied' do
          result = DoubleGdpSchema.execute(projects_query, context: {
                                             current_user: site_worker,
                                             site_community: site_worker.community,
                                           }, variables: {
                                             quarter: 'Q1',
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'projects').length).to eql 1
          expect(result.dig('data', 'projects', 0, 'id')).to eql(first_note.id)
        end

        it 'throws an error if invalid quarter is supplied' do
          expect do
            DoubleGdpSchema.execute(projects_query, context: {
                                      current_user: site_worker,
                                      site_community: site_worker.community,
                                    }, variables: {
                                      quarter: 'Q9',
                                    }).as_json
          end.to raise_error('Invalid argument. quarter should be either Q1, Q2, Q3 or Q4')
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
          community_id: site_worker.community_id,
          author_id: site_worker.id,
          due_date: Time.zone.today,
          parent_note_id: third_note.id,
        )

        variables = {
          taskId: third_note.id,
        }
        result = DoubleGdpSchema.execute(project_open_tasks_query, context: {
                                           current_user: site_worker,
                                           site_community: site_worker.community,
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
                                           site_community: site_worker.community,
                                         }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'processes').length).to eql 1
      end
    end
  end
end

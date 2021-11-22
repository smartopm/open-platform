# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::QueryType do
  describe 'event logs query' do
    before :each do
      @guard_role = create(:role, name: 'security_guard')
      @current_user = create(:security_guard, role: @guard_role)

      @user = create(:user, community: @current_user.community)
      3.times do
        Logs::EventLog.create(
          community: @current_user.community,
          ref_id: @user.id,
          ref_type: 'Users::User',
          subject: 'user_entry',
          acting_user: @current_user,
        )
      end
      3.times do
        # Will automatically created entry logs
        Logs::EntryRequest.create(name: 'Joe Visitor', user: @current_user)
      end

      @query =
        %(query AllEventLogs($subject: [String], $refId: ID, $refType: String){
          result: allEventLogs(subject: $subject, refId: $refId, refType:$refType) {
            id
            createdAt
            refId
            refType
            subject
            sentence
            data
            actingUser {
              name
              id
            }
          }
        })
    end

    it 'returns all event logs' do
      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: @current_user,
          site_community: @current_user.community,
        },
        variables: {
          subject: nil, refId: nil, refType: nil
        },
      ).as_json
      # we expect only 3 events since no event is created after an entry request
      expect(result.dig('data', 'result').length).to eql 3
    end

    it 'returns select event logs' do
      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: @current_user,
          site_community: @current_user.community,
        },
        variables: {
          subject: 'user_entry', refId: nil, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3

      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: @current_user,
          site_community: @current_user.community,
        },
        variables: {
          subject: nil, refId: nil, refType: 'Users::User'
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3

      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: @current_user,
          site_community: @current_user.community,
        },
        variables: {
          subject: nil, refId: @user.id, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3
    end

    it 'should fail if not logged in' do
      result = DoubleGdpSchema.execute(
        @query,
        context: { current_user: nil },
        variables: {
          subject: nil, refId: nil, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end

  describe 'event logs query for a user' do
    before :each do
      @current_user = create(:security_guard)
      @user = create(:user, community: @current_user.community)
      3.times do
        Logs::EventLog.create(
          community: @user.community,
          ref_id: @user.id,
          ref_type: 'Users::User',
          subject: 'user_login',
          acting_user: @user,
        )
      end

      @query =
        %(query AllEventLogsForUser($subject: [String], $userId: ID!){
          result: allEventLogsForUser(subject: $subject, userId: $userId) {
            id
            createdAt
            refId
            refType
            subject
            sentence
            data
            actingUser {
              name
              id
            }
          }
        })
    end

    it 'returns all event logs' do
      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: @current_user,
          site_community: @current_user.community,
        },
        variables: {
          subject: nil, userId: @user.id, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3
    end

    it 'should fail if not logged in' do
      result = DoubleGdpSchema.execute(
        @query,
        context: { current_user: nil },
        variables: {
          subject: nil, userId: @user.id, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end

  describe 'security guard list' do
    before :each do
      @user = create(:security_guard)
      @security_guard1 = create(:security_guard, community_id: @user.community_id)
      @security_guard2 = create(:security_guard, community_id: @user.community_id)
      @security_guard_another_commuinity = create(:security_guard)
      @current_user = @user

      @query =
        %(query {
          securityGuards {
            id
            name
            userType
          }
        })
    end

    it 'returns all security guards logs' do
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                         site_community: @current_user.community,
                                       }).as_json
      expect(result.dig('data', 'securityGuards').length).to eql 3
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(@query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end

  describe 'feedback' do
    before :each do
      @user = create(:security_guard)
      @current_user = create(:admin_user, community: @user.community)

      @query =
        %(query {
                usersFeedback {
                  review
                  isThumbsUp
                  user {
                    name
                  }
                }
            })
    end

    it 'returns all user feedback' do
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                         site_community: @current_user.community,
                                       }).as_json
      expect(result.dig('data', 'usersFeedback')).not_to be_nil
      expect(result['errors']).to be_nil
    end

    it 'should fails if not logged in' do
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: nil,
                                       }).as_json
      expect(result.dig('data', 'usersFeedback')).to be_nil
    end
  end
  # TODO: add more tests cases

  describe 'To-dos and notes in general' do
    let!(:admin_role) { create(:role, name: 'admin') }
    # let!(:resident_role) { create(:role, name: 'resident') }
    # let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[can_get_task_count can_get_task_stats
                                          can_fetch_flagged_notes can_fetch_task_histories
                                          can_fetch_task_comments can_fetch_task_by_id ])
    end

    let!(:admin) { create(:user_with_community, user_type: 'admin', role: admin_role) }
    let!(:current_user) { create(:user, community_id: admin.community_id) }
    let!(:searchable_user) { create(:user, name: 'Henry Tim', community_id: admin.community_id) }
    let!(:notes) do
      admin.community.notes.create!(
        body: 'This is a note',
        user_id: current_user.id,
        author_id: admin.id,
        flagged: false,
        category: 'call',
      )
    end
    let!(:other_notes) do
      current_user.community.notes.create!(
        body: 'This is a note',
        user_id: current_user.id,
        author_id: admin.id,
        flagged: true,
        due_date: -10.days.from_now,
        completed: false,
        category: 'call',
      )
    end
    let!(:admin_tasks) do
      admin.tasks.create!(
        body: 'This is another note',
        user_id: current_user.id,
        author_id: admin.id,
        flagged: true,
        community_id: admin.community_id,
        due_date: -10.days.from_now,
        completed: false,
        category: 'call',
      )
    end

    let(:flagged_query) do
      %(query($offset: Int, $limit: Int, $query: String) {
            flaggedNotes(offset: $offset, limit: $limit, query: $query) {
              body
              createdAt
              id
              user {
                name
              }
            }
        })
    end
    let(:notes_query) do
      %(query {
            allNotes {
              body
              createdAt
              id
            }
        })
    end

    let(:user_notes_query) do
      %(query {
            userNotes(id: "#{current_user.id}") {
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
        taskHistories(taskId: "#{notes.id}") {
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

    let(:task_comments_query) do
      %(query {
        taskComments(taskId: "#{notes.id}") {
          id
          body
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

    let(:task_query) do
      %(query {
        task(taskId: "#{other_notes.id}") {
          id
        }
      }
    )
    end

    let(:admin_task) do
      %(query{
          myTasksCount
      })
    end

    it 'should query all to-dos' do
      result = DoubleGdpSchema.execute(flagged_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'flaggedNotes')).not_to be_nil
      expect(result.dig('data', 'flaggedNotes').length).to eql 2
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

      result = DoubleGdpSchema.execute(flagged_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
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

      result = DoubleGdpSchema.execute(flagged_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }, variables: variables).as_json

      filtered_note = result.dig('data', 'flaggedNotes').select { |n| n['id'] == admin_tasks.id }
      expect(filtered_note.length).to eql 1
    end

    it 'should query all notes without tasks' do
      result = DoubleGdpSchema.execute(notes_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'allNotes')).not_to be_nil
      expect(result.dig('data', 'allNotes').length).to eql 1

      tasks = result.dig('data', 'allNotes').select { |n| n['id'] == admin_tasks.id }
      expect(tasks.length).to eql 0
    end

    it 'should query notes for the user' do
      result = DoubleGdpSchema.execute(user_notes_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'userNotes')).not_to be_nil
      expect(result.dig('data', 'userNotes').length).to eql 1
    end

    it 'should return unauthorized when user not admin' do
      result = DoubleGdpSchema.execute(user_notes_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'userNotes')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'should query tasks stats' do
      result = DoubleGdpSchema.execute(tasks_stats_query, context: {
                                         current_user: admin,
                                         site_community: admin.community,
                                       }).as_json

      expect(result.dig('data', 'taskStats')).not_to be_nil
      expect(result.dig('data', 'taskStats', 'completedTasks')).to eql 0
      expect(result.dig('data', 'taskStats', 'tasksOpenAndOverdue')).to eql 2
      expect(result.dig('data', 'taskStats', 'overdueTasks')).to eql 2
      expect(result.dig('data', 'taskStats', 'tasksWithNoDueDate')).to eql 0
    end

    it 'should query task histories' do
      notes.note_histories.create!(
        note_id: notes.id,
        user_id: admin.id,
        attr_changed: 'description',
        initial_value: 'initial description',
        updated_value: 'updated description',
        action: 'update',
        note_entity_type: 'Notes::Note',
        note_entity_id: notes.id,
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
      notes.note_comments.create!(
        user_id: admin.id,
        body: 'New Comment',
        status: 'active',
      )

      result = DoubleGdpSchema.execute(task_comments_query, context: {
                                         current_user: admin,
                                         site_community: admin.community,
                                       }).as_json

      expect(result['errors']).to be_nil

      task_comments = result.dig('data', 'taskComments')
      expect(task_comments.length).not_to eq 0

      task_comment = task_comments.select { |h| h['body'] == 'New Comment' }

      expect(task_comment.length).not_to eq 0
      expect(task_comment[0]['createdAt']).not_to be_nil
      expect(task_comment[0].dig('user', 'id')).to eq admin.id
    end

    it 'query individual task' do
      # task_query
      result = DoubleGdpSchema.execute(task_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result['errors']).to be_nil
      expect(result.dig('data', 'task')).not_to be_nil
      expect(result.dig('data', 'task', 'id')).to eql other_notes.id
    end

    it 'query admin tasks' do
      result = DoubleGdpSchema.execute(admin_task, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result['errors']).to be_nil
      expect(result.dig('data', 'myTasksCount')).not_to be_nil
      expect(result.dig('data', 'myTasksCount')).to eql 1
    end
  end
end

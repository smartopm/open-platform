# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::QueryType do
  describe 'event logs query' do
    before :each do
      @current_user = create(:security_guard)
      @user = create(:user, community: @current_user.community)
      3.times do
        EventLog.create(
          community: @current_user.community,
          ref_id: @user.id,
          ref_type: 'User',
          subject: 'user_entry',
          acting_user: @current_user,
        )
      end
      3.times do
        # Will automatically created entry logs
        EntryRequest.create(name: 'Joe Visitor', user: @current_user)
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
      expect(result.dig('data', 'result').length).to eql 6
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
          subject: nil, refId: nil, refType: 'User'
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
        EventLog.create(
          community: @user.community,
          ref_id: @user.id,
          ref_type: 'User',
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
      @current_user = create(:user, community: @user.community)

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
      expect(result.dig('errors')).to be_nil
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
    let!(:admin) { create(:user_with_community, user_type: 'admin') }
    let!(:current_user) { create(:user, community_id: admin.community_id) }
    let!(:notes) do
      admin.community.notes.create!(
        body: 'This is a note',
        user_id: current_user.id,
        author_id: admin.id,
        flagged: true,
        due_date: 10.days.from_now,
        completed: true,
      )
    end
    let!(:other_notes) do
      admin.community.notes.create!(
        body: 'This is a note',
        user_id: current_user.id,
        author_id: admin.id,
        flagged: true,
        due_date: -10.days.from_now,
        completed: false,
      )
    end

    let(:flagged_query) do
      %(query {
            flaggedNotes {
              body
              createdAt
              id
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
            userNotes(id: "#{admin.id}") {
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

    let(:task_query) do
      %(query {
        task(taskId: "#{other_notes.id}") {
          id
        }
      }
    )
    end

    it 'should query all to-dos' do
      result = DoubleGdpSchema.execute(flagged_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'flaggedNotes')).not_to be_nil
      expect(result.dig('data', 'flaggedNotes').length).to eql 2
    end

    it 'should query all notes' do
      result = DoubleGdpSchema.execute(notes_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'allNotes')).not_to be_nil
      expect(result.dig('data', 'allNotes').length).to eql 2
    end

    it 'should query all to-dos' do
      result = DoubleGdpSchema.execute(user_notes_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'userNotes')).not_to be_nil
    end

    it 'should query tasks stats' do
      result = DoubleGdpSchema.execute(tasks_stats_query, context: {
                                         current_user: admin,
                                         site_community: admin.community,
                                       }).as_json

      expect(result.dig('data', 'taskStats')).not_to be_nil
      expect(result.dig('data', 'taskStats', 'completedTasks')).to eql 1
      expect(result.dig('data', 'taskStats', 'tasksOpenAndOverdue')).to eql 1
      expect(result.dig('data', 'taskStats', 'overdueTasks')).to eql 1
      expect(result.dig('data', 'taskStats', 'tasksWithNoDueDate')).to eql 0
    end

    it 'query individual task' do
      # task_query
      result = DoubleGdpSchema.execute(task_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('errors')).to be_nil
      expect(result.dig('data', 'task')).not_to be_nil
      expect(result.dig('data', 'task', 'id')).to eql other_notes.id
    end
  end
end

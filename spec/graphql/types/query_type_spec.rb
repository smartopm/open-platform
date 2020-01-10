# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::QueryType do
  describe 'user' do
    let!(:current_user) { create(:user_with_community) }
    let!(:another_user) { create(:user_with_community, community_id: current_user.community_id) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }

    let(:query) do
      %(query {
        user(id:"#{current_user.id}") {
          id
        }
      })
    end

    let(:priviledged_query) do
      %(query {
        user(id:"#{current_user.id}") {
          id
          phoneNumber
          notes {
            body
          }
        }
      })
    end

    it 'returns all items' do
      current_user.notes.create(author_id: admin.id, body: 'test')
      result = DoubleGdpSchema.execute(query, context: { current_user: current_user }).as_json
      expect(result.dig('data', 'user', 'id')).to eql current_user.id
    end

    it 'should fail if not logged in' do
      result = DoubleGdpSchema.execute(query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'user')).to be_nil
    end

    it 'hide priviledged information' do
      result = DoubleGdpSchema.execute(priviledged_query, context:
                                       { current_user: another_user }).as_json
      current_user.notes.create(author_id: admin.id, body: 'test')
      expect(result.dig('data', 'user', 'id')).to_not be_nil
      expect(result.dig('data', 'user', 'phoneNumber')).to be_nil
      expect(result.dig('data', 'user', 'notes')).to be_nil

      result = DoubleGdpSchema.execute(priviledged_query, context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'phoneNumber')).to eql current_user.phone_number
      expect(result.dig('data', 'user', 'notes').length).to eql 1

      # Visible to the owner
      result = DoubleGdpSchema.execute(priviledged_query, context:
                                       { current_user: current_user }).as_json
      expect(result.dig('data', 'user', 'phoneNumber')).to eql current_user.phone_number
    end
  end

  describe 'user_search' do
    before :each do
      @user = create(:user_with_community, name: 'Joe Test')
      @admin_user = create(:user_with_community,
                           user_type: 'admin',
                           community_id: @user.community_id)
      @current_user = @admin_user

      @query =
        %(query($name: String!) {
          userSearch(name: $name) {
            id
            name
            userType
          }
        })
    end

    it 'returns all entry logs' do
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                       },
                                               variables: { name: 'Joe' }).as_json
      expect(result.dig('data', 'userSearch').length).to eql 1
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                       },
                                               variables: { name: 'Steve' }).as_json
      expect(result.dig('data', 'userSearch').length).to eql 0
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(@query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'userSearch')).to be_nil
    end
  end

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
        context: { current_user: @current_user },
        variables: {
          subject: nil, refId: nil, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 6
    end

    it 'returns select event logs' do
      result = DoubleGdpSchema.execute(
        @query,
        context: { current_user: @current_user },
        variables: {
          subject: 'user_entry', refId: nil, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3

      result = DoubleGdpSchema.execute(
        @query,
        context: { current_user: @current_user },
        variables: {
          subject: nil, refId: nil, refType: 'User'
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3

      result = DoubleGdpSchema.execute(
        @query,
        context: { current_user: @current_user },
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
        context: { current_user: @current_user },
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
                                       }).as_json
      expect(result.dig('data', 'securityGuards').length).to eql 3
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(@query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end
end

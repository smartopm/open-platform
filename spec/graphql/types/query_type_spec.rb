# frozen_string_literal: true

require 'rails_helper'

# TODO: Move these tests to their relevant files

RSpec.describe Types::QueryType do
  describe 'event logs query' do
    let!(:guard_role) { create(:role, name: 'security_guard') }
    let!(:current_user) { create(:security_guard, role: guard_role) }
    let!(:user) { create(:user, community: current_user.community) }

    before :each do
      3.times do
        Logs::EventLog.create(
          community: current_user.community,
          ref_id: user.id,
          ref_type: 'Users::User',
          subject: 'user_entry',
          acting_user: current_user,
        )
      end
      3.times do
        # Will automatically created entry logs
        Logs::EntryRequest.create(name: 'Joe Visitor', user: current_user)
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
            user {
              id
            }
            imageUrls
          }
        })
    end

    it 'returns all event logs' do
      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: current_user,
          site_community: current_user.community,
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
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: 'user_entry', refId: nil, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3

      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: nil, refId: nil, refType: 'Users::User'
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3

      result = DoubleGdpSchema.execute(
        @query,
        context: {
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: nil, refId: user.id, refType: nil
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
    let!(:current_user) { create(:security_guard) }
    let!(:user) { create(:user, community: current_user.community) }
    before :each do
      3.times do
        Logs::EventLog.create(
          community: user.community,
          ref_id: user.id,
          ref_type: 'Users::User',
          subject: 'user_login',
          acting_user: user,
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
          current_user: current_user,
          site_community: current_user.community,
        },
        variables: {
          subject: nil, userId: user.id, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'result').length).to eql 3
    end

    it 'should fail if not logged in' do
      result = DoubleGdpSchema.execute(
        @query,
        context: { current_user: nil },
        variables: {
          subject: nil, userId: user.id, refType: nil
        },
      ).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end

  describe 'security guard list' do
    let!(:user) { create(:security_guard) }
    let!(:security_guard1) do
      create(:security_guard, community_id: user.community_id, role: user.role)
    end
    let!(:security_guard2) do
      create(:security_guard, community_id: user.community_id, role: user.role)
    end
    let!(:community) { create(:community) }
    let!(:role) { create(:role, name: 'security_guard', community: community) }
    let!(:security_guard_another_commuinity) do
      create(:security_guard, community: community, role: role)
    end
    let!(:current_user) { user }

    let(:query) do
      %(query {
          securityGuards {
            id
            name
            userType
          }
        })
    end

    it 'returns all security guards logs' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'securityGuards').length).to eql 3
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'securityGuards')).to be_nil
    end
  end

  describe 'feedback' do
    let!(:user) { create(:security_guard) }
    let!(:current_user) { create(:admin_user, community: user.community) }

    let(:query) do
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
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'usersFeedback')).not_to be_nil
      expect(result['errors']).to be_nil
    end

    it 'should fails if not logged in' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: nil,
                                       }).as_json
      expect(result.dig('data', 'usersFeedback')).to be_nil
    end
  end
  # TODO: add more tests cases
end

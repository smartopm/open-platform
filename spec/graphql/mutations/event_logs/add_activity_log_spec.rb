# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActivityLog::Add do
  describe 'user' do
    let!(:user) { create(:user_with_community) }
    let!(:visitor_role) { user.role }
    let!(:deactivated_user) do
      create(:user,
             community: user.community,
             role: visitor_role,
             status: 'deactivated')
    end
    let!(:reporting_user) { create(:user, community_id: user.community_id, role: user.role) }
    let!(:other_community_user) { create(:user_with_community, role: user.role) }

    let(:query) do
      <<~GQL
        mutation AddActivityLogMutation($userId: ID!, $timestamp: String, $digital: Boolean, $note: String, $subject: String) {
          activityLogAdd(userId: $userId, timestamp: $timestamp, digital: $digital, note: $note, subject: $subject) {
            status
            eventLog {
              actingUser {
                id
              }
              data
              subject
              id
            }
          }
        }
      GQL
    end

    it 'should create an activity log' do
      variables = {
        userId: user.id,
        timestamp: (Time.now.to_f * 1000).floor.to_s,
        digital: true,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                user_role: user.role,
                                                site_community: user.community,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'id')).not_to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'actingUser', 'id')).to eql user.id
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'data')).not_to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'data', 'digital')).to eql true
    end

    it 'should create an entry_request after creating a user_entry event' do
      variables = {
        userId: user.id,
      }
      expect(user.community.entry_requests.count).to eql 0
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: user.community,
                                                user_role: user.role,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(user.community.entry_requests.count).to eql 1
      request = user.community.entry_requests.find_by(guest_id: user.id)
      expect(request.granted_state).to eql 3
    end

    it 'should grant access to an entry_request if user status is active' do
      variables = {
        userId: user.id,
      }
      user.entry_requests.create!(
        guest_id: user.id,
        name: user.name,
      )
      expect(user.community.entry_requests.count).to eql 1
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: user.community,
                                                user_role: user.role,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'activityLogAdd', 'status')).to eql 'success'
      # we should expect the same count of entry requests
      request = user.community.entry_requests.find_by(guest_id: user.id)
      expect(user.community.entry_requests.count).to eql 1
      expect(request.granted_state).to eql 3
      expect(request.grantor.id).to eql user.id
    end

    it 'should allow all users to create an activity log' do
      variables = {
        userId: user.id,
      }
      result = DoubleGdpSchema.execute(
        query, variables: variables, context: {
          current_user: other_community_user,
          user_role: other_community_user.role,
          site_community: other_community_user.community,
        }
      ).as_json
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'id')).not_to be_nil
      expect(result['errors']).to be_nil
    end

    it 'should create a user referred event' do
      variables = {
        userId: user.id,
        subject: 'user_referred',
      }
      result = DoubleGdpSchema.execute(
        query, variables: variables, context: {
          current_user: user,
          user_role: user.role,
          site_community: user.community,
        }
      ).as_json

      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'id')).not_to be_nil
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'actingUser', 'id')).to eql user.id
      expect(result.dig('data', 'activityLogAdd', 'eventLog', 'subject')).to eql 'user_referred'
      expect(result['errors']).to be_nil
    end

    context 'when user is deactivated' do
      it 'should not grant access to the user' do
        variables = { userId: deactivated_user.id }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: deactivated_user,
                                                  user_role: deactivated_user.role,
                                                  site_community: deactivated_user.community,
                                                }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'activityLogAdd', 'eventLog', 'id')).to be_nil
        expect(result.dig('data', 'activityLogAdd', 'status')).to eql 'denied'
      end
    end
  end
end

# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActivityLog::Add do
  describe 'user' do
    let!(:user) { create(:user_with_community) }
    let!(:reporting_user) { create(:user, community_id: user.community_id) }
    let!(:other_community_user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation AddActivityLogMutation($userId: ID!, $timestamp: String, $digital: Boolean, $note: String, $subject: String) {
          activityLogAdd(userId: $userId, timestamp: $timestamp, digital: $digital, note: $note, subject: $subject) {
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
    end

    it 'should grant access to an entry_request if request already exist' do
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
  end
end

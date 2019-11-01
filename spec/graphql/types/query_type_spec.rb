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
        }
      })
    end

    it 'returns all items' do
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
      expect(result.dig('data', 'user', 'id')).to_not be_nil
      expect(result.dig('data', 'user', 'phoneNumber')).to be_nil

      result = DoubleGdpSchema.execute(priviledged_query, context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'phoneNumber')).to eql current_user.phone_number

      # Visible to the owner
      result = DoubleGdpSchema.execute(priviledged_query, context:
                                       { current_user: current_user }).as_json
      expect(result.dig('data', 'user', 'phoneNumber')).to eql current_user.phone_number
    end
  end

  describe 'entry_logs' do
    before :each do
      @user = create(:user_with_community)
      @reporting_user = create(:user_with_community, community_id: @user.community_id)
      @current_user = @reporting_user

      3.times do
        @user.activity_logs.create(reporting_user_id: @reporting_user.id)
      end
      @query =
        %(query {
        entryLogs(userId:"#{@user.id}") {
          id
          createdAt
          note
          reportingUser{
            name
          }
        }
      })
    end

    it 'returns all entry logs' do
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                       }).as_json
      expect(result.dig('data', 'entryLogs').length).to eql 3
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(@query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'entryLogs')).to be_nil
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
end

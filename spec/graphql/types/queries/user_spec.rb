# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::User do
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

    let(:users_query) do
      %(query users($userType: String) {
        users(userType: $userType) {
            name
            id
            userType
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

    it 'should return users with provided usertype' do
      variables = {
        userType: 'admin',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: admin,
                                                    }).as_json
      expect(result.dig('errors')).to be_nil
      expect(result.dig('data', 'users').length).to eql 1
    end

    it 'should return all users when no user type is specified' do
      variables = {
        userType: '',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: admin,
                                                    }).as_json
      expect(result.dig('data', 'users').length).to eql 3
      expect(result.dig('errors')).to be_nil
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
        %(query($query: String!) {
          userSearch(query: $query) {
            id
            name
            userType
          }
        })
    end

    it 'returns user who matches the query ' do
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                       },
                                               variables: { query: 'Joe' }).as_json

      expect(result.dig('data', 'userSearch').length).to eql 1
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(@query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'userSearch')).to be_nil
    end
  end
end

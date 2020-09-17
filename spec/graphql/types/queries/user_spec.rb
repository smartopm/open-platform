# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::User do
  describe 'user' do
    let!(:current_user) { create(:user_with_community, user_type: 'client') }
    let!(:another_user) do
      create(:user_with_community,
             user_type: 'client',
             community_id: current_user.community_id)
    end
    let!(:prospective_client) do
      create(:user_with_community,
             user_type: 'prospective_client',
             community_id: current_user.community_id)
    end
    let!(:client) do
      create(:user_with_community,
             user_type: 'client',
             community_id: current_user.community_id)
    end
    let!(:custodian) do
      create(:user_with_community,
             user_type: 'custodian',
             community_id: current_user.community_id)
    end
    let!(:security_guard) do
      create(:user_with_community,
             user_type: 'security_guard',
             community_id: current_user.community_id)
    end
    let!(:contractor) do
      create(:user_with_community,
             user_type: 'contractor',
             community_id: current_user.community_id)
    end
    let!(:resident) do
      create(:user_with_community,
             user_type: 'resident',
             community_id: current_user.community_id)
    end
    let!(:visitor) do
      create(:user_with_community,
             user_type: 'visitor',
             community_id: current_user.community_id)
    end
    let!(:admin) { create(:admin_user, community_id: current_user.community_id, email: "ab@dc.ef") }

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

    let(:user_search_query) do
      %(query {
        user(id:"userid") {
          id
          phoneNumber
          notes {
            body
          }
        }
      })
    end

    let(:users_query) do
      %(query users($query: String) {
        users(query: $query) {
            name
            id
            userType
            }
        })
    end

    let(:admins_query) do
      %(
        query usersLite($query: String!){
          usersLite(query: $query) {
            id
            name
          }
      })
    end

    it 'returns all items' do
      current_user.notes.create(author_id: admin.id, body: 'test')
      result = DoubleGdpSchema.execute(query, context: { current_user: current_user }).as_json
      expect(result.dig('data', 'user', 'id')).to eql current_user.id
    end

    it 'returns list of admins' do
      variables = {
        query: 'user_type: admin',
      }
      result = DoubleGdpSchema.execute(admins_query, variables: variables,
                                                     context: { current_user: admin }).as_json
      expect(result.dig('data', 'usersLite', 0, 'id')).to_not be_nil
      expect(result.dig('data', 'usersLite', 0, 'name')).to_not be_nil
      expect(result.dig('data', 'usersLite').length).to eql 1 # only one admin
    end

    it 'checking individual permissions' do
      # admin can see all user_types
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', prospective_client.id),
                                       context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'id')).to eql prospective_client.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', visitor.id),
                                       context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'id')).to eql visitor.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', client.id),
                                       context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'id')).to eql client.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', custodian.id),
                                       context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'id')).to eql custodian.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', security_guard.id),
                                       context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'id')).to eql security_guard.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', contractor.id),
                                       context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'id')).to eql contractor.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', resident.id),
                                       context: { current_user: admin }).as_json
      expect(result.dig('data', 'user', 'id')).to eql resident.id

      # any users can see admin
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: prospective_client }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: visitor }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: client }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: custodian }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: security_guard }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: contractor }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: resident }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id

      # prospective client can only see admin
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: prospective_client }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', prospective_client.id),
                                       context: { current_user: prospective_client }).as_json
      expect(result.dig('data', 'user', 'id')).to eql prospective_client.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', client.id),
                                       context: { current_user: prospective_client }).as_json
      expect(result.dig('data', 'user', 'id')).to be_nil
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', custodian.id),
                                       context: { current_user: prospective_client }).as_json
      expect(result.dig('data', 'user', 'id')).to be_nil
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', security_guard.id),
                                       context: { current_user: prospective_client }).as_json
      expect(result.dig('data', 'user', 'id')).to be_nil
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', contractor.id),
                                       context: { current_user: prospective_client }).as_json
      expect(result.dig('data', 'user', 'id')).to be_nil
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', resident.id),
                                       context: { current_user: prospective_client }).as_json
      expect(result.dig('data', 'user', 'id')).to be_nil

      # custodian client can only see admin / security guard / contractor
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', admin.id),
                                       context: { current_user: custodian }).as_json
      expect(result.dig('data', 'user', 'id')).to eql admin.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', prospective_client.id),
                                       context: { current_user: custodian }).as_json
      expect(result.dig('data', 'user', 'id')).to be_nil
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', client.id),
                                       context: { current_user: custodian }).as_json
      expect(result.dig('data', 'user', 'id')).to be_nil
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', custodian.id),
                                       context: { current_user: custodian }).as_json
      expect(result.dig('data', 'user', 'id')).to eql custodian.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', security_guard.id),
                                       context: { current_user: custodian }).as_json
      expect(result.dig('data', 'user', 'id')).to eql security_guard.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', contractor.id),
                                       context: { current_user: custodian }).as_json
      expect(result.dig('data', 'user', 'id')).to eql contractor.id
      result = DoubleGdpSchema.execute(user_search_query.sub('userid', resident.id),
                                       context: { current_user: custodian }).as_json
      expect(result.dig('data', 'user', 'id')).to be_nil
    end

    it 'should fail if not logged in' do
      result = DoubleGdpSchema.execute(query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'user')).to be_nil
    end

    it 'hide priviledged information' do
      result = DoubleGdpSchema.execute(priviledged_query, context: {
                                         current_user: another_user,
                                         site_community: another_user.community,
                                       }).as_json
      current_user.notes.create(author_id: admin.id, body: 'test')
      expect(result.dig('errors')).to_not be_nil
      expect(result.dig('errors')[0]['message']).to eql 'Unauthorized'
      expect(result.dig('data', 'user', 'id')).to be_nil
      expect(result.dig('data', 'user', 'phoneNumber')).to be_nil
      expect(result.dig('data', 'user', 'notes')).to be_nil

      result = DoubleGdpSchema.execute(priviledged_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'user', 'phoneNumber')).to eql current_user.phone_number
      expect(result.dig('data', 'user', 'notes')).to eql []

      # Visible to the owner
      result = DoubleGdpSchema.execute(priviledged_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'user', 'phoneNumber')).to eql current_user.phone_number
    end

    it 'should return users with provided usertype' do
      variables = {
        query: 'admin',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: admin,
                                                    }).as_json
      expect(result.dig('errors')).to be_nil
      expect(result.dig('data', 'users').length).to eql 1
    end

    it 'should search by email of a user' do
      variables = {
        query: 'ab@dc.ef',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: admin,
                                                    }).as_json
      expect(result.dig('errors')).to be_nil
      expect(result.dig('data', 'users').length).to eql 1
    end

    it 'should find users by phoneNumber when passed to the query' do
      variables = {
        query: '1404555121',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: admin,
                                                    }).as_json
      expect(result.dig('errors')).to be_nil
      expect(result.dig('data', 'users').length).to eql 10
    end

    it 'should return all users when no user type is specified' do
      variables = {
        query: '',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: admin,
                                                    }).as_json
      expect(result.dig('data', 'users').length).to eql 10
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

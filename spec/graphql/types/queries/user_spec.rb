# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::User do
  describe 'user' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:client_role) { create(:role, name: 'client') }
    let!(:prospective_client_role) { create(:role, name: 'prospective_client') }

    let!(:custodian_role) { create(:role, name: 'custodian') }
    let!(:security_guard_role) { create(:role, name: 'security_guard') }
    let!(:contractor_role) { create(:role, name: 'contractor') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_view_admin_users can_get_users_lite can_get_users
                                          can_search_user_ids])
    end
    let!(:current_user) { create(:user_with_community, user_type: 'client', role: client_role) }
    let!(:secondary_number) do
      create(:contact_info, contact_type: 'phone', info: '99887766', user: current_user)
    end
    let!(:secondary_email) do
      create(:contact_info, contact_type: 'email', info: 'test@dgdp.com', user: current_user)
    end
    let!(:another_user) do
      create(:user_with_community,
             user_type: 'client',
             community_id: current_user.community_id,
             role: client_role)
    end
    let!(:prospective_client) do
      create(:user_with_community,
             user_type: 'prospective_client',
             community_id: current_user.community_id,
             role: prospective_client_role)
    end
    let!(:client) do
      create(:user_with_community,
             user_type: 'client',
             community_id: current_user.community_id,
             role: client_role)
    end
    let!(:custodian) do
      create(:user_with_community,
             user_type: 'custodian',
             community_id: current_user.community_id,
             role: custodian_role)
    end
    let!(:security_guard) do
      create(:user_with_community,
             user_type: 'security_guard',
             community_id: current_user.community_id,
             role: security_guard_role)
    end
    let!(:contractor) do
      create(:user_with_community,
             user_type: 'contractor',
             community_id: current_user.community_id,
             role: contractor_role)
    end
    let!(:resident) do
      create(:user_with_community,
             user_type: 'resident',
             community_id: current_user.community_id,
             role: resident_role)
    end
    let!(:visitor) do
      create(:user_with_community,
             user_type: 'visitor',
             community_id: current_user.community_id,
             role: visitor_role)
    end
    let!(:admin) do
      create(:admin_user, community_id: current_user.community_id,
                          email: 'ab@dc.ef', state: 'valid', role: admin_role)
    end
    let!(:another_admin) do
      create(:admin_user, name: 'another_admin', community_id: current_user.community_id,
                          email: 'cd@dc.ef', state: 'valid', role: admin_role)
    end

    let(:query) do
      %(query {
        user(id:"#{current_user.id}") {
          id
          avatarUrl
          accounts {
            id
          }
          secondaryEmail
          secondaryPhoneNumber
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
        query usersLite($query: String!, $limit: Int){
          usersLite(query: $query, limit: $limit) {
            id
            name
            avatarUrl
            accounts {
              id
            }
          }
      })
    end

    let(:admins_users_query) do
      %(
        query adminUsers{
          adminUsers {
            id
            name
          }
      })
    end

    let(:active_plan_query) do
      %(
        query plans {
          userActivePlan
        }
      )
    end

    let(:search_ids_query) do
      %(
        query SearchUserId($query: String, $userIds: [String!]){
          searchUserIds(query: $query, userIds: $userIds) {
            id
            name
            imageUrl
            avatarUrl
          }
      })
    end

    it 'returns all items' do
      current_user.notes.create(author_id: admin.id, body: 'test')
      result = DoubleGdpSchema.execute(query, context: { current_user: current_user }).as_json
      user_data = result.dig('data', 'user')
      expect(user_data['id']).to eql current_user.id
      expect(user_data['secondaryEmail']).to eq 'test@dgdp.com'
      expect(user_data['secondaryPhoneNumber']).to eq '99887766'
    end

    it 'returns list of admins' do
      variables = {
        query: 'user_type: admin',
      }
      result = DoubleGdpSchema.execute(admins_query, variables: variables,
                                                     context: { current_user: admin }).as_json
      expect(result.dig('data', 'usersLite', 0, 'id')).to_not be_nil
      expect(result.dig('data', 'usersLite', 0, 'name')).to_not be_nil
      expect(result.dig('data', 'usersLite').length).to eql 2 # only one admin
    end

    it 'admin_users query' do
      result = DoubleGdpSchema.execute(admins_users_query,
                                       context: { current_user: admin,
                                                  site_community: admin.community }).as_json
      expect(result.dig('data', 'adminUsers', 0, 'id')).to_not be_nil
      expect(result.dig('data', 'adminUsers', 0, 'name')).to_not be_nil
      expect(result.dig('data', 'adminUsers').length).to eql 2 # admin with valid state
    end

    it 'admin_users query returns unauthorised if current user is not admin' do
      result = DoubleGdpSchema.execute(admins_users_query,
                                       context: { current_user: current_user,
                                                  site_community: admin.community }).as_json
      expect(result['errors']).to_not be_nil
      expect(result['errors'][0]['message']).to eql 'Unauthorized'
    end

    it 'returns unauthorized when invalid current user' do
      variables = {
        query: 'user_type: admin',
      }
      result = DoubleGdpSchema.execute(admins_query,
                                       variables: variables,
                                       context: { current_user: current_user }).as_json
      expect(result['errors']).to_not be_nil
      expect(result['errors'][0]['message']).to eql 'Unauthorized'
    end

    it 'returns limited number of users if limit is supplied' do
      variables = {
        query: 'user_type: admin', limit: 1
      }
      result = DoubleGdpSchema.execute(admins_query, variables: variables,
                                                     context: { current_user: admin }).as_json
      expect(result.dig('data', 'usersLite', 0, 'id')).to_not be_nil
      expect(result.dig('data', 'usersLite', 0, 'name')).to_not be_nil
      expect(result.dig('data', 'usersLite').length).to eql 1 # only one admin
    end

    it 'returns searched users from userids' do
      variables = {
        query: current_user.name, userIds: [current_user.id]
      }
      result = DoubleGdpSchema.execute(search_ids_query, variables: variables,
                                                         context: { current_user: admin }).as_json

      expect(result.dig('data', 'searchUserIds', 0, 'id')).to_not be_nil
      expect(result.dig('data', 'searchUserIds', 0, 'name')).to_not be_nil
      expect(result.dig('data', 'searchUserIds', 0, 'id')).to eql current_user.id
      expect(result.dig('data', 'searchUserIds', 0, 'name')).to eql current_user.name
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
      expect(result['errors']).to_not be_nil
      expect(result['errors'][0]['message']).to eql 'Unauthorized'
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
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'users').length).to eql 2
    end

    it 'should search by email of a user' do
      variables = {
        query: 'ab@dc.ef',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: admin,
                                                    }).as_json
      expect(result['errors']).to be_nil
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
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'users').length).to eql 11
    end

    it 'should return all users when no user type is specified' do
      variables = {
        query: '',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: admin,
                                                    }).as_json
      expect(result.dig('data', 'users').length).to eql 11
      expect(result['errors']).to be_nil
    end

    it 'should check if a user has active payment plan' do
      result = DoubleGdpSchema.execute(active_plan_query,
                                       context: {
                                         current_user: admin,
                                       }).as_json
      expect(result.dig('data', 'userActivePlan')).to eql false
      expect(result['errors']).to be_nil
    end
    it 'should not check if a user has active payment plan when no user is logged in' do
      result = DoubleGdpSchema.execute(active_plan_query,
                                       context: {
                                         current_user: nil,
                                       }).as_json
      expect(result['errors'][0]['message']).to eql 'Unauthorized'
    end

    it 'returns unauthorized when current user not an admin' do
      variables = {
        query: 'ab@dc.ef',
      }
      result = DoubleGdpSchema.execute(users_query, variables: variables,
                                                    context: {
                                                      current_user: current_user,
                                                    }).as_json
      expect(result['errors']).to_not be_nil
      expect(result['errors'][0]['message']).to eql 'Unauthorized'
    end
  end

  describe 'user_search' do
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_search_guests can_view_guests can_view_hosts])
    end
    let!(:user) { create(:user_with_community, name: 'Jose', role: visitor_role) }
    let!(:user2) do
      create(:user_with_community, name: 'Josè', community: user.community, role: visitor_role)
    end
    let!(:admin_user) do
      create(:user_with_community, name: 'Joe Test', user_type: 'admin',
                                   role: admin_role, community_id: user.community_id)
    end
    let!(:visitor) do
      create(:user_with_community, user_type: 'visitor', email: 'visiting@admin.com',
                                   community_id: user.community_id, role: visitor_role)
    end

    let!(:invite) do
      entry = admin_user.entry_requests.create!(name: visitor.name)
      Logs::Invite.create!(host_id: admin_user.id, guest_id: visitor.id, entry_request_id: entry.id)
    end

    let(:query) do
      %(query($query: String!) {
          userSearch(query: $query) {
            id
            name
            userType
          }
        })
    end

    let(:guest_search_query) do
      %(
          query searchGuest($query: String) {
            searchGuests(query: $query) {
              id
              name
              email
              imageUrl
              avatarUrl
            }
          }
        )
    end

    let(:my_guest_search_query) do
      %(
          query guests($query: String){
            myGuests(query: $query) {
              id
              guest {
                id
                name
                imageUrl
                avatarUrl
              }
              thumbnailUrl
            }
          }
        )
    end

    let(:my_hosts_query) do
      %(
          query guests($userId: ID!){
            myHosts(userId: $userId) {
              id
              host {
                id
                name
                imageUrl
                avatarUrl
              }
            }
          }
        )
    end

    context 'when users are present with special characters' do
      it 'returns the list of users with name matching with normal and special character' do
        result = DoubleGdpSchema.execute(query, context: {
                                           current_user: admin_user,
                                           site_community: admin_user.community,
                                         }, variables: { query: 'Jose' }).as_json
        user_data = result.dig('data', 'userSearch')
        expect(result.dig('data', 'userSearch').length).to eql 2
        expect(%w[Jose Josè]).to include(user_data[0]['name'])
        expect(%w[Jose Josè]).to include(user_data[1]['name'])
      end
    end

    it 'returns user who matches the query ' do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: admin_user,
                                       },
                                              variables: { query: 'Joe' }).as_json

      expect(result.dig('data', 'userSearch').length).to eql 1
      expect(result.dig('data', 'userSearch')[0]['name']).to eql 'Joe Test'
    end

    it 'searches by contact info' do
      admin_user.contact_infos.create(contact_type: 'phone', info: '09056783452')
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: admin_user,
                                       },
                                              variables: {
                                                query: 'contact_info: 09056783452',
                                              }).as_json

      expect(result.dig('data', 'userSearch').length).to eql 1
      expect(result.dig('data', 'userSearch')[0]['name']).to eql 'Joe Test'
    end

    it 'searches visitors' do
      result = DoubleGdpSchema.execute(guest_search_query, context: {
                                         current_user: admin_user,
                                         site_community: admin_user.community,
                                       },
                                                           variables: {
                                                             query: 'visiting@admin.com',
                                                           }).as_json

      expect(result.dig('data', 'searchGuests').length).to eql 1
      expect(result.dig('data', 'searchGuests')[0]['name']).to eql 'Mark Test'
    end

    it 'searches for guests I invited' do
      result = DoubleGdpSchema.execute(my_guest_search_query, context: {
                                         current_user: admin_user,
                                       },
                                                              variables: {
                                                                query: 'visiting@admin.com',
                                                              }).as_json

      expect(result.dig('data', 'myGuests').length).to eql 1
    end

    it 'returns list of my hosts' do
      result = DoubleGdpSchema.execute(my_hosts_query, context: {
                                         current_user: admin_user,
                                         site_community: admin_user.community,
                                       },
                                                       variables: {
                                                         userId: visitor.id,
                                                       }).as_json
      expect(result.dig('data', 'myHosts').length).to eql 1
    end

    it 'returns nil when not authorized ' do
      result = DoubleGdpSchema.execute(my_hosts_query, context: {
                                         current_user: user,
                                         site_community: admin_user.community,
                                       },
                                                       variables: {
                                                         userId: visitor.id,
                                                       }).as_json
      expect(result.dig('data', 'myHosts')).to be_nil
      expect(result['errors'][0]['message']).to eq('Unauthorized')
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'userSearch')).to be_nil
    end

    it ' guest_search_query should fail if no logged in' do
      result = DoubleGdpSchema.execute(guest_search_query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'searchGuests')).to be_nil
    end

    it ' guest_search_query should fail if no logged in' do
      result = DoubleGdpSchema.execute(my_guest_search_query, context:
                                                { current_user: nil }).as_json
      expect(result.dig('data', 'myGuests')).to be_nil
    end
  end

  describe 'user_activity_point' do
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:user) { create(:user_with_community, role: visitor_role) }
    let!(:activity_point) { create(:activity_point, user: user, article_read: 2, referral: 10) }
    let(:query) do
      %(query userActivityPoint {
          userActivityPoint {
            userId
            total
            articleRead
            articleShared
            comment
            login
            referral
          }
        })
    end

    it "returns user's current activity point" do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: user,
                                       }).as_json

      expect(result.dig('data', 'userActivityPoint', 'userId')).to eq(user.id)
      expect(result.dig('data', 'userActivityPoint', 'total')).to eq(12)
      expect(result.dig('data', 'userActivityPoint', 'articleRead')).to eq(2)
      expect(result.dig('data', 'userActivityPoint', 'articleShared')).to eq(0)
      expect(result.dig('data', 'userActivityPoint', 'comment')).to eq(0)
      expect(result.dig('data', 'userActivityPoint', 'login')).to eq(0)
      expect(result.dig('data', 'userActivityPoint', 'referral')).to eq(10)
    end

    it "returns 'unauthorized' if user is not logged in" do
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: nil,
                                       }).as_json

      expect(result['errors']).to_not be_nil
      expect(result['errors'][0]['message']).to eq('Unauthorized')
    end

    it "creates a new empty user's activity point if there's no current one" do
      activity_point.update!(created_at: 10.days.ago)
      prev_activtity_point_count = Users::ActivityPoint.count
      result = DoubleGdpSchema.execute(query, context: {
                                         current_user: user,
                                       }).as_json

      expect(result.dig('data', 'userActivityPoint', 'userId')).to eq(user.id)
      expect(result.dig('data', 'userActivityPoint', 'total')).to eq(0)
      expect(result.dig('data', 'userActivityPoint', 'articleRead')).to eq(0)
      expect(result.dig('data', 'userActivityPoint', 'articleShared')).to eq(0)
      expect(result.dig('data', 'userActivityPoint', 'comment')).to eq(0)
      expect(result.dig('data', 'userActivityPoint', 'login')).to eq(0)
      expect(result.dig('data', 'userActivityPoint', 'referral')).to eq(0)
      expect(Users::ActivityPoint.count).to eql(prev_activtity_point_count + 1)
    end
  end

  describe 'users_count' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:client_role) { create(:role, name: 'client') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_get_user_count can_get_users can_get_substatus_count
                                          can_get_substatus_distribution])
    end

    let!(:admin_user) { create(:admin_user, role: admin_role) }
    let!(:client_user) do
      create(:user_with_community, user_type: 'client',
                                   community: admin_user.community,
                                   role: client_role)
    end
    let!(:resident) do
      create(:user_with_community, user_type: 'resident',
                                   community: admin_user.community,
                                   role: resident_role)
    end
    let!(:second_community) { create(:community) }
    let!(:second_community_user) { create(:user_with_community, community: second_community) }

    let(:query) do
      %(query usersCount($query: String) {
        usersCount(query: $query)
      })
    end

    let(:substatus_query) do
      %(
          query subs {
            substatusQuery {
              residentsCount
              plotsFullyPurchased
              eligibleToStartConstruction
              floorPlanPurchased
              buildingPermitApproved
              constructionInProgress
              constructionCompleted
              constructionInProgressSelfBuild
            }
          })
    end

    let(:substatus_distribution_query) do
      %(
          query substatusDistributionQuery {
            substatusDistributionQuery {
              plotsFullyPurchased{
                between0to10Days
                between11to30Days
                between31to50Days
                between51to150Days
                over151Days
              }
              floorPlanPurchased{
                between0to10Days
              }
              constructionInProgressSelfBuild{
                between0to10Days
              }
              constructionCompleted{
                between0to10Days
              }
              buildingPermitApproved{
                between0to10Days
              }
            }
          })
    end

    context 'when current user is not an admin' do
      it 'throws unauthorized error' do
        result = DoubleGdpSchema.execute(query, context: {
                                           current_user: client_user,
                                         }, variables: { query: 'user_type = "client"' })
                                .as_json

        expect(result['errors']).to_not be_nil
        expect(result['errors'][0]['message']).to eql 'Unauthorized'
      end

      it 'throws unauthorized error' do
        result = DoubleGdpSchema.execute(substatus_query, context: {
                                           current_user: client_user,
                                           site_community: client_user.community,
                                         }).as_json
        expect(result['errors']).to_not be_nil
        expect(result['errors'][0]['message']).to eql 'Unauthorized'
      end

      it 'throws unauthorized error' do
        result = DoubleGdpSchema.execute(substatus_distribution_query, context: {
                                           current_user: client_user,
                                           site_community: client_user.community,
                                         }).as_json
        expect(result['errors']).to_not be_nil
        expect(result['errors'][0]['message']).to eql 'Unauthorized'
      end
    end

    context 'when current user is admin' do
      before do
        admin_user.update(sub_status: :floor_plan_purchased)
        client_user.update(sub_status: :construction_in_progress_self_build)
        resident.update(sub_status: :construction_completed)
        second_community_user.update(sub_status: :building_permit_approved)
      end

      it 'returns users count based on the query' do
        result = DoubleGdpSchema.execute(query, context: {
                                           current_user: admin_user,
                                         }, variables: { query: 'user_type = "client"' })
                                .as_json

        expect(result.dig('data', 'usersCount')).to eq(1)
        expect(result['errors']).to be_nil
      end

      it 'returns the substatus report' do
        result = DoubleGdpSchema.execute(substatus_query, context: {
                                           current_user: admin_user,
                                           site_community: admin_user.community,
                                         }).as_json
        expect(result['errors']).to be_nil
        # returned result for non existing substatus is nil instead of 0
        substatus_query_data = result.dig('data', 'substatusQuery')
        expect(substatus_query_data['residentsCount']).to eql 1
        expect(substatus_query_data['plotsFullyPurchased']).to be_nil
        expect(substatus_query_data['eligibleToStartConstruction']).to be_nil
        expect(substatus_query_data['floorPlanPurchased']).to eql 1
        expect(substatus_query_data['buildingPermitApproved']).to be_nil
        expect(substatus_query_data['constructionInProgress']).to be_nil
        expect(substatus_query_data['constructionCompleted']).to eql 1
        expect(substatus_query_data['constructionInProgressSelfBuild']).to eql 1
      end

      it 'returns the substatus distribution report' do
        admin_log = create(:substatus_log, user_id: admin_user.id,
                                           community_id: admin_user.community.id,
                                           new_status: 'floor_plan_purchased',
                                           updated_by_id: admin_user.id)
        admin_user.update(latest_substatus_id: admin_log.id)
        client_log = create(:substatus_log, user_id: client_user.id,
                                            community_id: admin_user.community.id,
                                            new_status: 'construction_in_progress_self_build',
                                            updated_by_id: admin_user.id)
        client_user.update(latest_substatus_id: client_log.id)
        resident_log = create(:substatus_log, user_id: resident.id,
                                              community_id: admin_user.community.id,
                                              new_status: 'construction_completed',
                                              updated_by_id: admin_user.id)
        resident.update(latest_substatus_id: resident_log.id)

        result = DoubleGdpSchema.execute(substatus_distribution_query, context: {
                                           current_user: admin_user,
                                           site_community: admin_user.community,
                                         }).as_json

        expect(result['errors']).to be_nil
        distrubution_data = result.dig('data', 'substatusDistributionQuery')
        expect(distrubution_data['plotsFullyPurchased']).not_to be_nil
        expect(distrubution_data['plotsFullyPurchased']['between0to10Days']).to eq 0
        expect(distrubution_data['floorPlanPurchased']['between0to10Days']).to eq 1
        expect(distrubution_data['constructionInProgressSelfBuild']['between0to10Days']).to eq 1
        expect(distrubution_data['constructionCompleted']['between0to10Days']).to eq 1
        expect(distrubution_data['buildingPermitApproved']['between0to10Days']).to eq 0
      end
    end
  end
end

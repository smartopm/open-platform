# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GraphqlController, type: :controller do
  let!(:visitor_role) { create(:role, name: 'visitor') }
  let(:admin_role) { create(:role, name: 'admin') }
  let!(:permission) do
    create(:permission, module: 'discussion',
                        role: admin_role,
                        permissions: %w[can_create_post])
  end

  let!(:user) do
    create(:user_with_community,
           phone_number: '14048675309', role: visitor_role)
  end
  let!(:community) { user.community }
  let!(:admin) do
    create(:admin_user, user_type: 'admin', community_id: community.id, role: admin_role)
  end
  let(:discussion) { create(:discussion, community: community, user_id: admin.id) }
  let(:mutation) do
    <<~GQL
      mutation PostCreate($discussionId: ID!, $content: String) {
        postCreate(discussionId: $discussionId, content: $content){
          post{
            content
          }
        }
      }
    GQL
  end

  ENV['SECRET_KEY_BASE'] = '123456789'

  before do
    user.community.update(name: 'DoubleGDP')
    authenticate user
    authenticate admin
    @request.host = 'test.dgdp.site'
  end

  describe 'POST execute' do
    it 'basic execution of a query' do
      post :execute, params: {
        operationName: 'User',
        query: 'query User($id: ID!) {user(id: $id){id}}',
        variables: {
          id: user.id,
        },
      }
      body = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(body.dig('data', 'user', 'id')).to eql user.id
    end

    context 'when additional spaces are present in the arguments' do
      it 'removes extra spaces from the arguments' do
        post :execute, params: {
          query: mutation,
          variables: {
            discussionId: discussion.id,
            content: '   new post   ',
          },
          context: {
            current_user: admin,
            site_community: community,
          },
        }
        body = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
        expect(body.dig('data', 'postCreate', 'post', 'content')).to eql 'new post'
      end
    end
  end
end

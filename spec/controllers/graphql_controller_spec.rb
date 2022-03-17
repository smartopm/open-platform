# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GraphqlController, type: :controller do
  let!(:visitor_role) { create(:role, name: 'visitor') }
  let!(:user) do
    create(:user_with_community,
           phone_number: '14048675309', role: visitor_role)
  end
  before do
    user.community.update(name: 'DoubleGDP')
    authenticate user
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
  end
end

# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GraphqlController, type: :controller do
  before do
    @user = FactoryBot.create(:user_with_community, phone_number: '14048675309')
    authenticate @user
  end

  describe 'POST execute' do
    it 'basic execution of a query' do
      post :execute, params: {
        operationName: User,
        query: 'query User($id: ID!) {user(id: $id){id}}',
        variables: {
          id: @user.id,
        },
      }
      body = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(body.dig('data', 'user', 'id')).to eql @user.id
    end
  end
end

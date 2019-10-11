# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LoginController, type: :controller do
  before do
    @user = FactoryBot.create(:user_with_community, phone_number: '14048675309')
  end
  describe 'GET #index' do
    it 'returns http success' do
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #sms' do
    it 'validates a phone number and sends an sms' do
      expect(Sms).to receive(:send)
      post :sms, params: { phone_number: @user.phone_number }
      expect(response).to have_http_status(:success)
    end

    it 'handles unknown numbers' do
      post :sms, params: { phone_number: '123' }
      expect(response).to redirect_to(login_path)
    end
  end

  describe 'POST #sms_complete' do
    it 'handles valid token to login' do
      @user.create_new_phone_token
      post :sms_complete, params: { phone_number: @user.phone_number, token: @user.phone_token }
      expect(response).to redirect_to(root_path)
    end
  end
end

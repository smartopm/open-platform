# frozen_string_literal: true

require 'rails_helper'

RSpec.describe HomeController do
  describe 'GET index for autheticated users' do
    before do
      @request.env['devise.mapping'] = Devise.mappings[:user]
      sign_in FactoryBot.create(:user_with_membership)
    end
    it 'should only allow them to see the page' do
      get :index
      expect(response).to render_template(:index)
    end
  end
  describe 'GET index for unautheticated users' do
    before do
    end
    it 'should only allow them to see the page' do
      get :index
      expect(response).to redirect_to(new_user_session_path)
    end
  end
end

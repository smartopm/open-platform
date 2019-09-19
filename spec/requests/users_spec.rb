# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users', type: :request do
  describe 'GET /users' do
    before do
      sign_in FactoryBot.create(:user_with_membership)
    end
    it 'works! (now write some real specs)' do
      get users_path
      expect(response).to have_http_status(200)
    end
  end
end

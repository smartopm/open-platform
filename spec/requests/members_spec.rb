# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Members', type: :request do
  describe 'GET /members' do
    before do
      sign_in FactoryBot.create(:user_with_membership)
    end
    it 'works! (now write some real specs)' do
      get members_path
      expect(response).to have_http_status(200)
    end
  end
end

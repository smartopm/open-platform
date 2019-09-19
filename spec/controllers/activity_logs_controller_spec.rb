# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActivityLogsController, type: :controller do
  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]

    @community = FactoryBot.create(:community)
    @member = FactoryBot.create(:member, community_id: @community.id)
    @security_guard = FactoryBot.create(:member, community_id: @community.id)

    @user = FactoryBot.create(:user_with_membership)
    @activity = FactoryBot.create(:activity_log, reporting_member: @security_guard, member: @member)
    sign_in @user
  end
  describe 'GET #index' do
    it 'returns http success' do
      get :index, params: { community_id: @community.id }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET #show' do
    it 'returns http success' do
      get :show, params: { id: @activity.id }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    it 'returns http success' do
      post :create, params: { activity_log: { member_id: @member } }
      expect(response).to have_http_status(:redirect)
    end
  end
end

# frozen_string_literal: true

require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.
#
# Also compared to earlier versions of this generator, there are no longer any
# expectations of assigns and templates rendered. These features have been
# removed from Rails core in Rails 5, but can be added back in via the
# `rails-controller-testing` gem.

RSpec.describe MembersController, type: :controller do
  let(:community) do
    FactoryBot.create(:community)
  end
  let(:user) do
    FactoryBot.create(:user)
  end
  # This should return the minimal set of attributes required to create a valid
  # Member. As you add validations to Member, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) do
    {
      member_type: 'Contractor',
      user_id: user.id,
      community_id: community.id,
    }
  end

  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
    sign_in FactoryBot.create(:user_with_membership)
  end

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # MembersController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe 'GET #index' do
    it 'returns a success response' do
      Member.create! valid_attributes
      get :index, params: {}, session: valid_session
      expect(response).to be_successful
    end
  end

  describe 'GET #show' do
    it 'returns a success response' do
      member = Member.create! valid_attributes
      get :show, params: { id: member.to_param }, session: valid_session
      expect(response).to be_successful
    end
  end

  describe 'GET #new' do
    it 'returns a success response' do
      get :new, params: {}, session: valid_session
      expect(response).to be_successful
    end
  end

  describe 'GET #edit' do
    it 'returns a success response' do
      member = Member.create! valid_attributes
      get :edit, params: { id: member.to_param }, session: valid_session
      expect(response).to be_successful
    end
  end

  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new Member' do
        expect do
          post :create, params: { member: valid_attributes }, session: valid_session
        end.to change(Member, :count).by(1)
      end
    end
  end

  describe 'PUT #update' do
    context 'with valid params' do
      let(:new_attributes) do
        {
          member_type: 'Contractor',
          user_id: user.id,
          community_id: community.id,
        }
      end

      it 'updates the requested member' do
        member = Member.create! valid_attributes
        put :update, params: { id: member.to_param, member: new_attributes }, session: valid_session
        member.reload
      end

      it 'redirects to the member' do
        member = Member.create! valid_attributes
        put :update, params: { id: member.to_param, member: valid_attributes },
                     session: valid_session
        expect(response).to redirect_to(member)
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the requested member' do
      member = Member.create! valid_attributes
      expect do
        delete :destroy, params: { id: member.to_param }, session: valid_session
      end.to change(Member, :count).by(-1)
    end

    it 'redirects to the members list' do
      member = Member.create! valid_attributes
      delete :destroy, params: { id: member.to_param }, session: valid_session
      expect(response).to redirect_to(members_url)
    end
  end
end

# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'Creating a user from a oauth authentication callback' do
    let!(:community) { create(:community, name: 'Nkwashi') }
    auth_obj = OpenStruct.new(
      uid: 'abc12345',
      provider: 'google_oauth2',
      info: OpenStruct.new(
        name: 'Mark',
        email: 'mark@doublegdp.com',
        image: 'https://mypic.com/image.png',
      ),
      credentials: OpenStruct.new(
        token: '12345',
        expires: true,
        expires_at: 1_234_567_890,
        refresh_token: 'foo',
      ),
    )

    it 'should create a new user' do
      user = User.from_omniauth(auth_obj, community)
      expect(user.persisted?).to be true
      # TODO: Remove this once we fix hardcoding
      expect(user.community.name).to eql('Nkwashi')
    end

    it 'should update an existing user' do
      User.from_omniauth(auth_obj, community)
      auth_obj.info.name = 'Mark Percival'
      auth_obj.info.image = 'https://newprofile.com/pic.png'
      User.from_omniauth(auth_obj, community)
      users = User.where(uid: auth_obj.uid, provider: auth_obj.provider).all
      expect(users.length).to be 1
      expect(users[0].name).to eq 'Mark Percival'
      expect(users[0].image_url).to eq 'https://newprofile.com/pic.png'
      expect(users[0].oauth_expires).to be true
      # TODO: Remove this once we fix hardcoding
      expect(users[0].community).to_not be_nil
    end
  end

  describe 'Authenticating the user with a token via sms' do
    before :each do
      @user = FactoryBot.create(:user_with_community, phone_number: '14157351116')
    end

    it 'should create a token' do
      @user.create_new_phone_token
      expect(@user.phone_token).to be
      expect(@user.phone_token.length).to equal(User::PHONE_TOKEN_LEN)
      expect(@user.phone_token_expires_at <= User::PHONE_TOKEN_EXPIRATION_MINUTES.minutes.from_now)
        .to be true
    end

    it 'should accept a valid token' do
      token = @user.create_new_phone_token
      expect(@user.verify_phone_token!(token)).to be true
    end

    it 'should reject invalid and expired token' do
      token = @user.create_new_phone_token

      # With a wrong token
      wrong_token = (token.to_i(10) - 1).to_s(10)
      expect { @user.verify_phone_token!(wrong_token) }
        .to raise_exception(User::PhoneTokenResultInvalid)

      # With an expired token
      @user.update(phone_token_expires_at: 1.minute.ago)
      expect { @user.verify_phone_token!(token) }.to raise_exception(User::PhoneTokenResultExpired)
    end
  end

  describe 'User state and roles' do
    before :each do
      @user = FactoryBot.create(:user_with_community, phone_number: '14157351116')
    end

    it 'without a role/type it should be pending' do
      expect(@user.pending?).to be true
    end

    it 'Roles should have a human name' do
      @user.update(user_type: 'admin')
      expect(@user.role_name).to eql 'Admin'
    end

    it 'should be expired if it\'s expired' do
      @user.update(state: 'pending')
      expect(@user.state).to eql 'pending'
    end

    it 'should be expired if it\'s expired' do
      @user.update(expires_at: 1.week.ago)
      expect(@user.expired?).to be true
    end
  end

  describe 'User with user_type roles' do
    before :each do
      @security_guard = FactoryBot.create(:security_guard)
      @admin = FactoryBot.create(:admin_user, community: @security_guard.community)
      @user = FactoryBot.create(:user, community: @security_guard.community)
    end

    it 'should know if user an admin' do
      @user.update(user_type: 'admin')
      expect(@user.admin?).to be true
    end

    it 'should be able to check if user belongs to a role?' do
      expect(@admin.role?(%i[security_guard admin])).to be true
      expect(@admin.role?([:security_guard])).to be false
    end

    it 'should allow users to become other users' do
      expect(@admin.can_become?(@security_guard)).to be true
      expect(@user.can_become?(@security_guard)).to be false
      expect(@security_guard.can_become?(@admin)).to be false
    end
  end

  describe 'User phone numbers' do
    before :each do
      @user = FactoryBot.create(:user_with_community)
    end

    it 'should be valid' do
      @user.update(phone_number: '+1 415 735 1116')
      expect(@user.errors.messages[:phone_number]).to be_empty
    end

    it 'should be the proper length' do
      @user.update(phone_number: '+1 415 735')
      expect(@user.errors.messages[:phone_number]).to_not be_empty
    end

    it 'should not contain more than "-", " ", "+" and numbers' do
      @user.update(phone_number: '+1415.735.1116')
      expect(@user.errors.messages[:phone_number]).to_not be_empty
    end
  end

  describe 'User with user_type roles' do
    before :each do
      @security_guard = FactoryBot.create(:security_guard)
      @admin = FactoryBot.create(:admin_user, community: @security_guard.community)
      @user = FactoryBot.create(:user, community: @security_guard.community)
    end

    it 'should know if user an admin' do
      @user.update(user_type: 'admin')
      expect(@user.admin?).to be true
    end

    it 'should be able to check if user belongs to a role?' do
      expect(@admin.role?(%i[security_guard admin])).to be true
      expect(@admin.role?([:security_guard])).to be false
    end

    it 'should allow users to become other users' do
      expect(@admin.can_become?(@security_guard)).to be true
      expect(@user.can_become?(@security_guard)).to be false
      expect(@security_guard.can_become?(@admin)).to be false
    end

    it 'should allow admin to enroll users' do
      vals = {
        name: 'Mark Percival',
        email: 'mark@doublegdp.com',
        request_reason: 'Resident',
        vehicle: nil,
      }
      @nuser = @admin.enroll_user(vals)
      expect(@nuser.community_id).to be @admin.community_id
      expect(@nuser.id).to_not be_empty
      @nuser1 = nil
      begin
        @nuser1 = @admin.enroll_user(vals)
      rescue ActiveRecord::RecordNotUnique
        expect(@nuser1).to be nil
      end
      @el = EventLog.where(acting_user_id: @admin.id).last
      expect(@nuser.id).to eq @el.ref_id
      expect(@admin.id).to eq @el.acting_user_id
    end

    it 'it should create a todo after a referral client has been created' do
      user = FactoryBot.create(:user_with_community, phone_number: '34566784567')
      other_user = FactoryBot.create(:user_with_community, phone_number: '34566784561',
                                                           user_type: 'client')
      user_ref = {
        id: user.id,
        name: 'Test name',
      }
      expect(other_user.user_type).to_not eql 'admin'
      todo = other_user.referral_todo(user_ref)
      notes = Note.where(author_id: other_user.id)
      expect(Note.all.count).to eql 1
      expect(notes.length).to eql 1
      expect(todo).to_not be_nil
    end
  end

  describe 'User discussions' do
    let!(:community) { create(:community) }
    let!(:current_user) { create(:user, community_id: community.id) }
    # create a discussion for the user community
    let!(:user_discussion) do
      create(:discussion, user_id: current_user.id, community_id: current_user.community_id)
    end
    let!(:user_post_discussion) do
      create(:discussion, user_id: current_user.id, post_id: '20')
    end
    it 'should return community discussions' do
      expect(current_user.find_user_discussion(user_discussion.id, 'discuss')).not_to be_nil
      expect(current_user.find_user_discussion(user_discussion.id,
                                               'discuss').id).to eql user_discussion.id
    end
    it 'should return community post discussions' do
      expect(current_user.find_user_discussion(user_post_discussion.post_id, 'post')).not_to be_nil
      expect(current_user.find_user_discussion(user_post_discussion.post_id,
                                               'post').post_id).not_to be_nil
      expect(current_user.find_user_discussion(user_post_discussion.post_id,
                                               'post').post_id).to eql '20'
    end
  end
end

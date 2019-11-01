# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'Creating a user from a oauth authentication callback' do
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
      user = User.from_omniauth(auth_obj)
      expect(user.persisted?).to be true
      # TODO: Remove this once we fix hardcoding
      expect(user.community.name).to eql('Nkwashi')
    end

    it 'should update an existing user' do
      User.from_omniauth(auth_obj)
      auth_obj.info.name = 'Mark Percival'
      auth_obj.info.image = 'https://newprofile.com/pic.png'
      User.from_omniauth(auth_obj)
      users = User.where(uid: auth_obj.uid, provider: auth_obj.provider).all
      expect(users.length).to be 1
      expect(users[0].name).to eq 'Mark Percival'
      expect(users[0].image_url).to eq 'https://newprofile.com/pic.png'
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

    it 'after assinging a admin role, it should be an admin' do
      @user.update(user_type: 'admin')
      expect(@user.admin?).to be true
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

  describe 'User phone numbers' do
    before :each do
      @user = FactoryBot.create(:user_with_community)
    end

    it 'should be all numbers, and no more than 15 digits' do
      @user.update(phone_number: '+14157351116')
      expect(@user.errors.messages[:phone_number]).to_not be_nil
    end
  end
end

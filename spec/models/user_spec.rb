# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'Creating a user from a oauth authentication callback' do
    auth_obj = OpenStruct.new(
      uid: 'abc12345',
      provider: 'google',
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
    end

    it 'should update an existing user' do
      auth_obj.info.name = 'Mark Percival'
      auth_obj.info.image = 'https://newprofile.com/pic.png'
      User.from_omniauth(auth_obj)
      users = User.where(uid: auth_obj.uid, provider: auth_obj.provider).all
      expect(users.length).to be 1
      expect(users[0].name).to eq 'Mark Percival'
      expect(users[0].image_url).to eq 'https://newprofile.com/pic.png'
    end
  end
end

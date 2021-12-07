# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Role, type: :model do
  let!(:current_user) { create(:user_with_community) }
  describe 'crud' do
    it 'should allow to create a role' do
      Role.create(name: 'admin', community_id: current_user.community_id)
      expect(Role.all.length).to eql 2
      expect(current_user.community.roles.length).to eql 1
    end
  end
  describe 'associations' do
    it { should belong_to(:community).optional }
  end
end

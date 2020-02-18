# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Feedback, type: :model do
  # let!(:current_user) { create }
  # pending "add some examples to (or delete) #{__FILE__}"
  current_user = FactoryBot.create(:user_with_community)
  it 'should create user feedback' do
    Feedback.create(user_id: current_user.id, is_thumbs_up: true)
    expect(Feedback.all.length).to eql 1
  end
end

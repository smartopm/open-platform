# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Message, type: :model do
  # create Message
  it 'should create a message record' do
    Message.create(
      receiver: '260971500748',
      message: 'Testing out message',
    )
    result = Message.first
    expect(Message.all.count).to eql 1
    expect(result[:receiver]).to eql '260971500748'
  end
end

# frozen_string_literal: true

require 'rails_helper'
require 'email_msg'

RSpec.describe EmailMsg do
  before { Rails.env.stub(test?: false) }

  describe '.send_email' do
    it 'initializes sendgrid email class' do
      expect(SendGrid::Email).to receive(:new).twice.and_return(
        SendGrid::Email.new(email: 'gmail@gmail.com'),
      )
      EmailMsg.send_mail('gmail@gmail.com', '12345')
    end
  end

  describe '.send_mail_from_db' do
    it 'initializes sendgrid email class' do
      expect(SendGrid::Email).to receive(:new).twice.and_return(
        SendGrid::Email.new(email: 'gmail@gmail.com'),
      )
      EmailMsg.send_mail_from_db('gmail@gmail.com', OpenStruct.new(subject: 'My Mail'), [])
    end
  end

  describe '.messages_from_sendgrid' do
    it 'fetches nothinh from sendgrid since this is test' do
      expect(EmailMsg.messages_from_sendgrid).to eq(nil)
    end
  end
end

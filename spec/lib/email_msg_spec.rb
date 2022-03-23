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
      EmailMsg.send_mail_from_db(
        email: 'gmail@gmail.com',
        template: OpenStruct.new(subject: 'My Mail'),
        template_data: [],
      )
    end
    it 'raises error when email is nil' do
      expect do
        EmailMsg.send_mail_from_db(
          email: nil,
          template: OpenStruct.new(subject: 'My Mail'),
          template_data: [],
        )
      end.to raise_error(StandardError)
    end
    it 'raises error when template is nil' do
      expect do
        EmailMsg.send_mail_from_db(
          email: 'gmail@gmail.com',
          template: nil,
          template_data: [],
        )
      end.to raise_error(StandardError)
    end
  end

  describe '.messages_from_sendgrid' do
    it 'fetches nothing from sendgrid since this is test' do
      expect(EmailMsg.messages_from_sendgrid).to eq(nil)
    end
  end

  describe '#email_stats' do
    context 'when filtered mails are fetched' do
      it 'returns the list of filtered mails' do
        expect(EmailMsg.email_stats('campaign_id', '9hdwe9dhew9hd7ewhh')).to eq(nil)
      end
    end
  end
end

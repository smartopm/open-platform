# frozen_string_literal: true

require 'rails_helper'

describe TwilioController, type: :controller do
  let(:community) { create(:community, name: 'DoubleGDP', domains: ['test.dgdp.site']) }
  let!(:user) { create(:admin_user, community: community, phone_number: '260970000000') }
  describe '#webhook' do
    before do
      @request.host = 'test.dgdp.site'
    end

    context 'when whatsapp messages comes in' do
      let(:successful_response) do
        File.read('./spec/webmock/twilio_whatsapp_webhook.json')
      end

      context 'creates task' do
        it 'handles creation and updates of task' do
          post :webhook, params: JSON.parse(successful_response)
          expect(response).to have_http_status(:success)
          expect(community.notes.first.body).to eql 'Yes, Send QR Code.'
          expect(Sms).to receive(:send_whatsapp_message).with(
            '260970000000',
            community,
            'https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2F%2Frequest%2F%3Ftype%3Dscan&size=256x256',
          )
          # If second message comes in then we add it as a comment
          post :webhook, params: JSON.parse(successful_response)
          expect(community.notes.first.note_comments.first.body)
            .to eql 'Yes, Send QR Code.'
        end
      end
    end
  end
end

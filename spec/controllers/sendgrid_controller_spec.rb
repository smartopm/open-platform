# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SendgridController, type: :controller do
  describe 'POST to a webhook' do
    it 'basic execution of a query' do
      post :webhook, params: {
        token: 'somehsdferonsd',
        from: 'some user <user@dgdp.com>',
        text: 'This is an email',
        subject: 'urgent',
      }
      expect(response).to have_http_status(:success)
    end
  end
end

# frozen_string_literal: true

require 'rails_helper'

describe FlutterwaveController, type: :controller do
  let(:community) { create(:community, name: 'DoubleGDP', domains: ['test.dgdp.site']) }
  let(:admin) { create(:admin_user, community: community) }
  let!(:transaction_log) do
    create(:transaction_log, transaction_ref: '121', user: admin, community: community)
  end
  let(:secret_hash) { '{ "SECRET_HASH": "xzs-12-as" }' }
  describe '#webhook' do
    before do
      allow_any_instance_of(ApplicationHelper).to receive(:flutterwave_keys)
        .with(community.name).and_return(JSON.parse(secret_hash))
      @request.host = 'test.dgdp.site'
    end

    let(:params) do
      File.read('./spec/webmock/flutterwave_failed_webhook.json')
    end

    context 'when secret hash is invalid' do
      before { @request.headers['verif-hash'] = '12-as-daa' }

      it 'returns unauthorized' do
        post :webhook, params: JSON.parse(params)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when secret hash is valid' do
      let(:failed_response) do
        File.read('./spec/webmock/flutterwave_failed_webhook.json')
      end
      let(:successful_response) do
        File.read('./spec/webmock/flutterwave_success_webhook.json')
      end

      before { @request.headers['verif-hash'] = 'xzs-12-as' }

      context 'and transaction is failed' do
        it 'updates transaction log status to failed' do
          post :webhook, params: JSON.parse(failed_response)
          expect(response).to have_http_status(:success)
          expect(community.transaction_logs.first.status).to eql 'failed'
        end
      end

      context 'and transaction is successful' do
        it 'updates transaction log status to successful' do
          post :webhook, params: JSON.parse(successful_response)
          expect(response).to have_http_status(:success)
          expect(community.transaction_logs.first.status).to eql 'successful'
        end
      end
    end
  end
end

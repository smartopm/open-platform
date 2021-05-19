# frozen_string_literal: true

require 'rails_helper'
require 'host_env'

RSpec.describe HostEnv do
  before { ENV.stub(:[]).with('APP_ENV').and_return('production') }
  let!(:community1) do
    create(:community, name: 'DoubleGDP')
  end

  let!(:community2) do
    create(:community, name: 'Ciudad Morazán')
  end

  describe 'case doubleGDP' do
    it 'returns correct base url for doubleGDP' do
      url = HostEnv.base_url(community1)
      expect(url).to eql 'demo.doublegdp.com'
    end
  end

  describe 'case Ciudad Morazán' do
    it 'returns correct base url Ciudad Morazán' do
      url = HostEnv.base_url(community2)
      expect(url).to eql 'morazancity.doublegdp.com'
    end
  end
end

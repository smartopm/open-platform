# frozen_string_literal: true

require 'rails_helper'
require 'host_env'

RSpec.describe HostEnv do
  before do
    ENV.stub(:[]).with('BULLET_DEBUG').and_return(false)
    ENV.stub(:[]).with('APP_ENV').and_return('production')
  end
  let!(:community1) do
    create(:community, name: 'DoubleGDP')
  end
  
  let!(:community2) do
    create(:community, name: 'Ciudad Morazán')
  end
  
  let!(:community3) do
    create(:community, name: 'Tilisi')
  end
  
  let!(:community4) do
    create(:community, name: 'Testing')
  end

  describe 'case doubleGDP' do
    it 'returns correct base url for doubleGDP' do
      url = HostEnv.base_url(community1)
      expect(url).to eql 'demo.doublegdp.com'
    end
  end

  describe 'case Testing' do
    it 'returns correct base url for Testing' do
      url = HostEnv.base_url(community4)
      expect(url).to eql 'testing.doublegdp.com'
    end
  end

  describe 'case Ciudad Morazán' do
    it 'returns correct base url Ciudad Morazán' do
      url = HostEnv.base_url(community2)
      expect(url).to eql 'morazancity.doublegdp.com'
    end
  end

  describe 'Tilisi' do
    it 'returns correct base url Tilisi' do
      url = HostEnv.base_url(community3)
      expect(url).to eql 'tilisi.doublegdp.com'
    end
  end
end

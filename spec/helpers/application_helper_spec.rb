# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationHelper, type: :helper do
  describe 'wordpress_post_info' do
    it 'fetches a wordpress post and returns its info' do
      response_body = {
        title: 'Another title',
        excerpt: '<p>Some description here</p>',
        featured_image: 'https://encrypted-tbn0.gstatic.com/images?q=',
      }
      allow(Net::HTTP).to receive(:get_response)
        .and_return(OpenStruct.new(body: response_body.to_json))

      result = wordpress_post_info('/news/post/1234')
      expect(result[:title]).to eq('Another title')
      expect(result[:description]).to eq('Some description here')
      expect(result[:image]).to eq('https://encrypted-tbn0.gstatic.com/images?q=')
    end

    it 'returns empty hash if not a valid post-page' do
      result = wordpress_post_info('/my_tasks')
      expect(result).to eq({})
    end
  end

  describe 'manifest file' do
    it 'returns correct manifest file for community' do
      community = create(:community, name: 'Ciudad Morazán')
      expect(multi_tenancy_manifest_file(community.name)).to eq('/ciudadmorazanmanifest.json')
    end
    it 'returns correct manifest file for community' do
      community = create(:community, name: 'Nkwashi')
      expect(multi_tenancy_manifest_file(community.name)).to eq('/nkwashimanifest.json')
    end
  end
end

# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationHelper, type: :helper do
  describe 'wordpress_post_info' do
    wp_link = 'https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com'
    it 'fetches a wordpress post and returns its info' do
      response_body = {
        title: 'Another title',
        excerpt: '<p>Some description here</p>',
        featured_image: 'https://encrypted-tbn0.gstatic.com/images?q=',
      }
      allow(Net::HTTP).to receive(:get_response)
        .and_return(OpenStruct.new(body: response_body.to_json))

      result = wordpress_post_info('/news/post/1234', wp_link)

      expect(result[:title]).to eq('Another title')
      expect(result[:description]).to eq('Some description here')
      expect(result[:image]).to eq('https://encrypted-tbn0.gstatic.com/images?q=')
    end

    it 'returns empty hash if not a valid post-page' do
      result = wordpress_post_info('/my_tasks', wp_link)
      expect(result).to eq({})
    end
  end
end

# frozen_string_literal: true

# HomeController is our Root route for the application
class HomeController < ApplicationController
  before_action :authenticate_member!, except: [:hold]

  def index; end

  def hold; end

  def react
    render html: '', layout: 'react'
  end

  def qr_code
    url = 'https://api.qrserver.com/v1/create-qr-code/' \
          "?data=#{CGI.escape(params[:data])}&size=#{params[:size]}"
    image = Net::HTTP.get_response(URI.parse(url))
    send_data image.body, type: image.content_type, disposition: 'inline'
  end
end

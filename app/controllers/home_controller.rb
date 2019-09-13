# frozen_string_literal: true

# HomeController is our Root route for the application
class HomeController < ApplicationController
  before_action :authenticate_user!

  def index; end

  def scan
    render html: '', layout: 'react'
  end

end

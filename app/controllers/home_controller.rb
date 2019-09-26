# frozen_string_literal: true

# HomeController is our Root route for the application
class HomeController < ApplicationController
  before_action :authenticate_member!, except: [:hold]

  def index; end

  def hold; end

  def react
    render html: '', layout: 'react'
  end
end

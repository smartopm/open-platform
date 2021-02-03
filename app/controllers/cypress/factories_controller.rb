# frozen_string_literal: true

unless Rails.env.production?
  require Rails.root.join('spec/factories/community_factory.rb')
  require Rails.root.join('spec/factories/user_factory.rb')
end

# Cypress support to seed data
class Cypress::FactoriesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    factory = FactoryBot.create(factory_name, factory_attributes)
    render json: factory
  end

  def fetch_user
    user = User.find_by(phone_number: params[:phone])
    render json: user
  end

  private

  def factory_name
    params.fetch(:name)
  end

  def factory_attributes
    params.fetch(:attributes).permit!.to_h
  end
end

# frozen_string_literal: true
require "#{Rails.root}/spec/factories/community_factory.rb"
require "#{Rails.root}/spec/factories/user_factory.rb"

# Cypress support to seed data
class Cypress::FactoriesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    factory = FactoryBot.create(factory_name, factory_attributes)
    render json: factory
  end

  def record
    record = resource_name.camelize.constantize.find(params[:id])
    render json: record
  end

  private

  def factory_name
    params.fetch(:name)
  end

  def resource_name
    params.fetch(:resource)
  end

  def factory_attributes
    params.fetch(:attributes).permit!.to_h
  end
end

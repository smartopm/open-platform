# frozen_string_literal: true

# Cypress support to seed data
class Cypress::FactoriesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    factory = FactoryBot.create(factory_name, factory_attributes)
    render json: factory
  end

  private

  def factory_name
    params.fetch(:name)
  end

  def factory_attributes
    params.fetch(:attributes).permit!.to_h
  end
end

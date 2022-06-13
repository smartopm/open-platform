# frozen_string_literal: true

unless Rails.env.production?
  require Rails.root.join('spec/factories/community.rb')
  require Rails.root.join('spec/factories/users/user.rb')
  require Rails.root.join('spec/factories/properties/account.rb')
  require Rails.root.join('spec/factories/properties/land_parcel_account.rb')
  require Rails.root.join('spec/factories/properties/land_parcel.rb')
  require Rails.root.join('spec/factories/role.rb')
  require Rails.root.join('spec/factories/permission.rb')
end

# Cypress support to seed data
class Cypress::FactoriesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    return if Rails.env.production?

    factory = FactoryBot.create(factory_name, factory_attributes)
    render json: factory
  end

  def fetch_user
    user = Users::User.find_by(phone_number: params[:phone])
    render json: user
  end

  private

  def factory_name
    params.fetch(:name)
  end

  # rubocop:disable Metrics/MethodLength
  def factory_attributes
    params.fetch(:attributes).permit(
      :name,
      :phone_number,
      :email,
      :state,
      :community_id,
      :parcel_number,
      :user_id,
      :land_parcel_id,
      :account_id,
      :module,
      :role_id,
      permissions: [],
    ).to_h
  end
  # rubocop:enable Metrics/MethodLength
end

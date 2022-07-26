# frozen_string_literal: true

module Types
  # Message Type
  class LandParcelType < Types::BaseObject
    field :id, ID, null: false
    field :community, Types::CommunityType, null: false,
                                            resolve: Resolvers::BatchResolver.load(:community)
    field :parcel_number, String, null: false
    field :address1, String, null: true
    field :address2, String, null: true
    field :city, String, null: true
    field :postal_code, String, null: true
    field :state_province, String, null: true
    field :country, String, null: true
    field :parcel_type, String, null: true
    field :long_x, Float, null: true
    field :lat_y, Float, null: true
    field :geom, GraphQL::Types::JSON, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :read_at, GraphQL::Types::ISO8601DateTime, null: true
    field :valuations, [Types::ValuationType], null: false,
                                               resolve: Resolvers::BatchResolver.load(:valuations)
    field :accounts, [Types::AccountType], null: false,
                                           resolve: Resolvers::BatchResolver.load(:accounts)
    field :plot_sold, Boolean, null: true
    field :image_urls, [String], null: true
    field :payment_plans, [Types::PaymentPlanType],
          null: true,
          resolve: Resolvers::BatchResolver.load(:payment_plans)
    field :object_type, String, null: true
    field :status, String, null: true

    def image_urls
      type = :has_many_attached
      attachment_load('Properties::LandParcel', :images, object.id, type: type).then do |images|
        images_attached = []
        images.compact.select { |image| images_attached << host_url(image) }
        images_attached.empty? ? nil : images_attached
      end
    end

    def plot_sold
      batch_load(object, :accounts).then(&:present?)
    end

    def host_url(type)
      Rails.application.routes.url_helpers.rails_blob_url(type)
    end
  end
end

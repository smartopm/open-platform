# frozen_string_literal: true

require 'host_env'

module Types
  # LeadLogType
  class LeadLogType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :user, Types::UserType, null: false
    field :acting_user, Types::UserType, null: false
    field :log_type, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :amount, GraphQL::Types::Float, null: true
    field :investment_target, GraphQL::Types::Float, null: true
    field :deal_size, GraphQL::Types::Float, null: true
    field :target_amount, GraphQL::Types::Float, null: true

    def target_amount
      return unless object.log_type.eql?('deal_details')

      (object.deal_size * object.investment_target) / 100
    end
  end
end

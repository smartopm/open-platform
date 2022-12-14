# frozen_string_literal: true

require 'host_env'

module Types
  # LeadLogType
  class LeadLogType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :acting_user, Types::UserType, null: false,
                                         resolve: Resolvers::BatchResolver.load(:acting_user)
    field :log_type, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :amount, GraphQL::Types::Float, null: true
    field :investment_target, GraphQL::Types::Float, null: true
    field :deal_size, GraphQL::Types::Float, null: true
    field :target_percent, GraphQL::Types::Float, null: true

    def target_percent
      return unless object.log_type.eql?('deal_details')

      ((object.investment_target / object.deal_size) * 100).floor(2)
    end
  end
end

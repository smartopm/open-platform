module Types
    class CampaignType < Types::BaseObject
      field :community_id, ID, null: false
      field :name, String, null: false
      field :message, String, null: false
      field :user_id_list, String, null: false
      field :start_time, GraphQL::Types::ISO8601DateTime, null: true
      field :end_time, GraphQL::Types::ISO8601DateTime, null: true
      field :batch_time, GraphQL::Types::ISO8601DateTime, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
      field :read_at, GraphQL::Types::ISO8601DateTime, null: true
    end
  end
  
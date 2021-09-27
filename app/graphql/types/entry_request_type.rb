# frozen_string_literal: true

module Types
  # EntryRequestType
  class EntryRequestType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :grantor, Types::UserType, null: true
    field :name, String, null: true
    field :email, String, null: true
    field :nrc, String, null: true
    field :phone_number, String, null: true
    field :vehicle_plate, String, null: true
    field :reason, String, null: true
    field :other_reason, String, null: true
    field :subject, String, null: true
    field :concern_flag, GraphQL::Types::Boolean, null: true
    field :granted_state, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :granted_at, GraphQL::Types::ISO8601DateTime, null: true
    field :source, String, null: true
    field :acknowledged, Boolean, null: true
    field :visitation_date, GraphQL::Types::ISO8601DateTime, null: true
    field :visit_end_date, GraphQL::Types::ISO8601DateTime, null: true
    field :start_time, String, null: true
    field :end_time, String, null: true
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: true
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: true
    field :company_name, String, null: true
    field :occurs_on, [String], null: true
    field :revoked_at, GraphQL::Types::ISO8601DateTime, null: true
    field :entry_request_state, Integer, null: true
    field :active, Boolean, null: true
    field :revoked, Boolean, null: true

    def active
      object.active?
    end

    def revoked
      object.revoked?
    end
  end
end

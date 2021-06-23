# frozen_string_literal: true

module Types
  # EntryRequestType
  class EntryRequestType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :grantor, Types::UserType, null: true
    field :name, String, null: true
    field :nrc, String, null: true
    field :phone_number, String, null: true
    field :vehicle_plate, String, null: true
    field :reason, String, null: true
    field :other_reason, String, null: true
    field :subject, String, null: true
    field :concern_flag, GraphQL::Types::Boolean, null: true
    field :granted_state, Integer, null: true
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
    field :granted_at, Types::Scalar::DateType, null: true
    field :source, String, null: true
    field :acknowledged, Boolean, null: true
    field :visitation_date, Types::Scalar::DateType, null: true
    field :start_time, String, null: true
    field :end_time, String, null: true
  end
end

# frozen_string_literal: true

module Types
  # ActivityLogType
  class EventLogType < Types::BaseObject
    field :id, ID, null: false
    field :acting_user_id, ID, null: true
    field :acting_user, Types::UserType, null: true
    field :ref_id, ID, null: true
    field :ref_type, String, null: true
    field :entry_request, Types::EntryRequestType, null: true
    field :community, Types::CommunityType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :subject, String, null: true
    field :data, GraphQL::Types::JSON, null: true
    field :sentence, String, null: true

    def sentence
      object.to_sentence
    end

    def entry_request
      return nil unless object.subject == 'visitor_entry'

      EntryRequest.find(object.ref_id)
    end
  end
end

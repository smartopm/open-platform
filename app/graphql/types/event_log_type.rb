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
    field :user, Types::UserType, null: true
    field :community, Types::CommunityType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :subject, String, null: true
    field :data, GraphQL::Types::JSON, null: true
    field :sentence, String, null: true
    field :source, String, null: true
    field :has_exited, Boolean, null: true

    def sentence
      object.to_sentence
    end

    def entry_request
      return nil if object.ref_type != 'Logs::EntryRequest'

      # Logs::EntryRequest.find_by(id: object.ref_id)
      object.ref
    end

    def user
      return nil if object.ref_type != 'Users::User'

      # Users::User.find_by(id: object.ref_id)
      object.ref
    end

    # rubocop:disable Naming/PredicateName
    def has_exited
      Logs::EventLog.where("data->>'note' = ? AND subject = ? AND ref_id = ?", 'Exited',
                           'observation_log', object.ref_id).present?
    end
    # rubocop:enable Naming/PredicateName
  end
end

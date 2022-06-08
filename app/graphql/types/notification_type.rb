# frozen_string_literal: true

require 'host_env'

module Types
  # NotificationType
  class NotificationType < Types::BaseObject
    field :id, ID, null: false
    field :category, String, null: true
    field :notifable_id, ID, null: true
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :seen_at, GraphQL::Types::ISO8601DateTime, null: true
    field :header, String, null: true

    # rubocop:disable Metrics/CyclomaticComplexity
    def header
      case object.category
      when 'comment', 'reply_requested'
        object.notifable&.note&.body
      when 'task'
        object.notifable&.body
      when 'message'
        object.notifable&.sender&.name
      end
    end
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end

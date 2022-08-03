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

    def header
      batch_load(object, :notifable).then do |notifable|
        case object.category
        when 'comment', 'reply_requested'
          notifable&.body
        when 'task'
          notifable&.body
        when 'message'
          batch_load(notifable, :sender).then(&:name)
        end
      end
    end
  end
end

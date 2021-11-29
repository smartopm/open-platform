# frozen_string_literal: true

module Types
  # Details about people who have visited the community
  class PeopleStatisticType < Types::BaseObject
    field :people_present, Integer, null: true
    field :people_entered, [Types::EntryRequestType], null: true
    field :people_exited, [Types::EntryRequestType], null: true
  end
end

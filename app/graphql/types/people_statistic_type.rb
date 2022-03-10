# frozen_string_literal: true

module Types
  # Details about people who have visited the community
  class PeopleStatisticType < Types::BaseObject
    field :people_present, Integer, null: true
    field :people_entered, Integer, null: true
    field :people_exited, Integer, null: true
  end
end

# frozen_string_literal: true

# showroom queries
module Types::Queries::Showroom
  extend ActiveSupport::Concern

  included do
    # Get showroom entries
    field :showroom_entries, [Types::ShowroomType], null: true do
      description 'Get all showroom entries'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def showroom_entries(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    Showroom.all.limit(limit).offset(offset)
  end
end

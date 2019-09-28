# frozen_string_literal: true

module Mutations
  # Our BaseMutation Parent Class
  class BaseMutation < GraphQL::Schema::Mutation
    # Allows us to force the current member without a header
    # Will still check to see if the member is a child of current_user
    argument :acting_member_id, ID, required: false
  end
end

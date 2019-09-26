# frozen_string_literal: true

# Our GraphQL Policy for filtering certain field
class GraphqlPolicy
  RULES = {
    Types::UserType => {
      members: ->(obj, _args, ctx) { ctx[:current_user].id == obj.id },
    },
  }.freeze

  def self.guard(type, field)
    RULES.dig(type, field)
  end
end

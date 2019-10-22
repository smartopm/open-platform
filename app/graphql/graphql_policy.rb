# frozen_string_literal: true

# Our GraphQL Policy for filtering certain field
class GraphqlPolicy
  RULES = {
  }.freeze

  def self.guard(type, field)
    RULES.dig(type, field)
  end
end

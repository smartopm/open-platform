# frozen_string_literal: true

# Our GraphQL Schema Class
class DoubleGdpSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)
  use GraphQL::Guard.new(policy_object: GraphqlPolicy)
end

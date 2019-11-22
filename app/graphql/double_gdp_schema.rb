# frozen_string_literal: true

# Our GraphQL Schema Class
class DoubleGdpSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)
  use GraphQL::Guard.new(policy_object: GraphqlPolicy)

  rescue_from(User::PhoneTokenResultInvalid,
              User::PhoneTokenResultExpired) do |_err, _obj, _args, _ctx, _field|
    # Raise a graphql-friendly error with a custom message
    raise GraphQL::ExecutionError, 'Invalid or expired phone token'
  end

  rescue_from(ActiveRecord::RecordNotFound) do |_err, _obj, _args, _ctx, field|
    # Raise a graphql-friendly error with a custom message
    raise GraphQL::ExecutionError, "#{field.type.unwrap.graphql_name} not found"
  end
end

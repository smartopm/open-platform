# frozen_string_literal: true

# Our GraphQL Schema Class
class DoubleGdpSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)
  # Commenting unused policy since it is causing error with upgraded rails version : Saurabh
  # use GraphQL::Guard.new(policy_object: GraphqlPolicy)
  use(GraphQL::Tracing::NewRelicTracing)

  rescue_from(Users::User::PhoneTokenResultInvalid,
              Users::User::PhoneTokenResultExpired) do |_err, _obj, _args, _ctx, _field|
    # Raise a graphql-friendly error with a custom message
    raise GraphQL::ExecutionError, 'Invalid or expired phone token'
  end

  rescue_from(Users::User::ExpiredSignature,
              Users::User::DecodeError) do |_err, _obj, _args, _ctx, _field|
    # Raise a graphql-friendly error with a custom message
    raise GraphQL::ExecutionError, 'Invalid or expired auth token'
  end

  rescue_from(ActiveRecord::RecordNotFound) do |err|
    # Raise a graphql-friendly error with a custom message
    raise GraphQL::ExecutionError, "#{err.model} not found"
  end
end

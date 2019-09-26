# frozen_string_literal: true

module Types
  # BaseField
  class BaseField < GraphQL::Schema::Field
    argument_class Types::BaseArgument

    def resolve_field(obj, args, ctx)
      resolve(obj, args, ctx)
    end
  end
end

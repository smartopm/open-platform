# frozen_string_literal: true

module Mutations
  # Our BaseMutation Parent Class
  class BaseMutation < GraphQL::Schema::Mutation
    class MutationArgumentError < GraphQL::ExecutionError; end

    private

    # TODO: eventually replace with CanCanCan
    def check_params(rules, values)
      user_type = context[:current_user]&.user_type
      raise MutationArgumentError unless user_type

      rule_set = rules[user_type.to_sym]
      check_permitted(values, rule_set[:permit]) if rule_set[:permit]
      check_excepted(values, rule_set[:except]) if rule_set[:except]
    end

    def check_permitted(values, keys)
      values.each_pair do |key, _val|
        raise MutationArgumentError, 'Unauthorized Arguments' unless keys.include(key)
      end
    end

    def check_excepted(values, keys)
      keys.each do |key|
        raise MutationArgumentError, 'Unauthorized Arguments' if values.key?(key)
      end
    end
  end
end

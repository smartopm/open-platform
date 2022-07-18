# frozen_string_literal: true

module Resolvers
  # Batch resolver
  class BatchResolver
    include ::GraphqlBatchHelper

    attr_reader :object, :context

    def self.load(association_name)
      lambda { |object, args, context|
        resolver = new(object, context)
        resolver.resolve(association_name, **args)
      }
    end

    def initialize(object, context)
      @object = object
      @context = context
    end

    def resolve(association_name, _args)
      batch_load(@object, association_name)
    end

    private :object, :context
  end
end

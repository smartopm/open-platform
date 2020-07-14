# frozen_string_literal: true

module Types
  # BaseField
  class BaseField < GraphQL::Schema::Field
    argument_class Types::BaseArgument
    def initialize(*args, **kwargs, &block)
      @visible = kwargs.delete(:visible)
      super
    end

    def authorized?(object, context)
      return visible_to_role(context) || visible_to_owner(object, context) if @visible

      super
    end

    private

    def visible_to_role(context)
      if @visible[:roles]
        raise GraphQL::VisibilityError.new("You do not have permission to access #{self.original_name.to_s}") unless context[:current_user]&.role?(@visible[:roles])
      end
      true
    end

    def visible_to_owner(object, context)
      if @visible[:user] && context[:current_user]
        raise GraphQL::VisibilityError.new("You do not have permission to access #{self.original_name.to_s}") unless context[:current_user].id == object[@visible[:user]]
      end
      true
    end
  end
end

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
      return true if @visible[:roles] && context[:current_user]&.role?(@visible[:roles])

      raise GraphQL::VisibilityError, I18n.t('error.visibility', field: original_name)
    end

    def visible_to_owner(object, context)
      return true if @visible[:user] && context[:current_user] &&
                     context[:current_user].id == object[@visible[:user]]

      raise GraphQL::VisibilityError, I18n.t('error.visibility', field: original_name)
    end
  end
end

# frozen_string_literal: true

module Mutations
  # Our BaseMutation Parent Class
  class BaseMutation < GraphQL::Schema::Mutation
    class MutationArgumentError < GraphQL::ExecutionError; end
    include ::PermissionsHelper

    private

    def ensure_logged_in
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless context[:current_user]
    end

    def check_params(rules, values)
      user_type = context[:current_user]&.user_type
      raise MutationArgumentError unless user_type

      rule_set = rules[user_type.to_sym]
      check_permitted(values, rule_set[:permit]) if rule_set[:permit]
      check_excepted(values, rule_set[:except]) if rule_set[:except]
    end

    def check_permitted(values, keys)
      values.each_pair do |key, _val|
        raise MutationArgumentError, 'Unauthorized Arguments' unless keys.include?(key)
      end
    end

    def check_excepted(values, keys)
      keys.each do |key|
        raise MutationArgumentError, 'Unauthorized Arguments' if values.key?(key)
      end
    end

    def raise_duplicate_number_error(phone_number)
      return unless phone_number

      user = context[:current_user].find_via_phone_number(phone_number)
      return if user.nil?

      raise GraphQL::ExecutionError, I18n.t('errors.duplicate.phone')
    end

    def raise_duplicate_email_error(email)
      return if email.blank?

      user = context[:site_community].users.find_any_via_email(email)
      return if user.nil?

      raise GraphQL::ExecutionError, I18n.t('errors.duplicate.email')
    end

    # Raises GraphQL execution error
    # * if user does not exist
    # * if user is deactivated
    #
    # @return [GraphQL::ExecutionError]
    def raise_user_login_specific_error(user)
      message = I18n.t('errors.user.not_found') if user.nil?
      message = I18n.t('errors.user.cannot_access_app') if user&.deactivated?

      return if message.blank?

      raise GraphQL::ExecutionError, message
    end

    def raise_error_message(message)
      raise GraphQL::ExecutionError, message
    end
  end
end

# frozen_string_literal: true

module Mutations
  module EmailTemplate
    # update an email template
    class TemplateUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :subject, String, required: false
      argument :body, String, required: true
      argument :data, GraphQL::Types::JSON, required: true

      field :email_template, Types::EmailTemplateType, null: true

      def resolve(vals)
        template = context[:site_community].email_templates.find(vals[:id])
        raise_template_not_found_error(template)

        return { email_template: template } if template.update(vals)

        raise GraphQL::ExecutionError, template.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :email_template, permission: :can_update_email_template)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if template does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_template_not_found_error(template)
        return if template

        raise GraphQL::ExecutionError,
              I18n.t('errors.email_template.not_found')
      end
    end
  end
end

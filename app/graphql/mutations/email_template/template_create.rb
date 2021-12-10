# frozen_string_literal: true

module Mutations
  module EmailTemplate
    # Create a new EmailTemplate
    class TemplateCreate < BaseMutation
      argument :name, String, required: true
      argument :subject, String, required: true
      argument :body, String, required: true
      argument :data, GraphQL::Types::JSON, required: true

      field :email_template, Types::EmailTemplateType, null: true

      def resolve(vals)
        email = context[:site_community].email_templates.create(vals)

        return { email_template: email } if email.persisted?

        raise GraphQL::ExecutionError, email.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :email_template, permission: :can_create_email_template)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

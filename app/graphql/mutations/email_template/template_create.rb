# frozen_string_literal: true

module Mutations
  module EmailTemplate
    # Create a new EmailTemplate
    class TemplateCreate < BaseMutation
      argument :name, String, required: true
      argument :subject, String, required: true
      argument :body, String, required: true

      field :email_template, Types::EmailTemplateType, null: true

      def resolve(vals)
        email = context[:site_community].email_templates.create(vals)

        return { email_template: email } if email.persisted?

        raise GraphQL::ExecutionError, email.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end

# frozen_string_literal: true

# email template queries
module Types::Queries::EmailTemplate
  extend ActiveSupport::Concern

  included do
    # Get email template
    field :email_template, Types::EmailTemplateType, null: true do
      description 'get an email template for the provided id'
      argument :id, GraphQL::Types::ID, required: true
    end
    # Get email templates
    field :email_templates, [Types::EmailTemplateType], null: true do
      description 'get all email templates'
    end
  end

  def email_template(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    email = context[:site_community].email_templates.find(id)
    raise GraphQL::ExecutionError, 'email template not found' if email.nil?

    email
  end

  def email_templates
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].email_templates
  end
end

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
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
    # Get email template variable list
    field :email_template_variables, [GraphQL::Types::String], null: true do
      description 'get an email template variables names for the provided id'
      argument :id, GraphQL::Types::ID, required: true
    end
  end

  def email_template(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    email = context[:site_community].email_templates.find(id)
    raise GraphQL::ExecutionError, 'email template not found' if email.nil?

    email
  end

  def email_templates(offset: 0, limit: 50)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    context[:site_community].email_templates.order(created_at: :desc).limit(limit).offset(offset)
  end

  def email_template_variables(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    vars = []
    template = context[:site_community].email_templates.find(id)
    JSON.parse(template&.template_variables).each { |_key, value| vars.concat(value) }
    vars
  end
end

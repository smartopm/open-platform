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
    unless permitted?(module: :email_template, permission: :can_view_email_template)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    email = context[:site_community].email_templates.find(id)
    return email if email.present?

    raise GraphQL::ExecutionError, I18n.t('errors.email_template.not_found')
  end

  def email_templates(offset: 0, limit: 50)
    unless permitted?(module: :email_template, permission: :can_view_email_templates)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].email_templates.order(created_at: :desc).limit(limit).offset(offset)
  end

  def email_template_variables(id:)
    unless permitted?(module: :email_template, permission: :can_view_email_template_variables)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    vars = []
    template = context[:site_community].email_templates.find(id)
    JSON.parse(template&.template_variables).each { |_key, value| vars.concat(value) }
    vars
  end
end

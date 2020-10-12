# frozen_string_literal: true

module Mutations
  module Form
    # For adding form users
    class FormUserCreate < BaseMutation
      argument :form_id, ID, required: true
      argument :user_id, ID, required: true
      argument :status, String, required: false
      argument :values, GraphQL::Types::JSON, required: true

      field :form_user, Types::FormUsersType, null: true

      def resolve(vals)
        form = context[:site_community].forms.find(vals[:form_id])
        raise GraphQL::ExecutionError, 'Form not found' if form.nil?

        vals = vals.merge(status_updated_by: context[:current_user])
        ActiveRecord::Base.transaction do
          form_user = form.form_users.new(vals.except(:form_id, :values))
          return add_user_form_properties(form_user, vals) if form_user.save

          raise GraphQL::ExecutionError, form_user.errors.full_messages
        end
      end
      # rubocop:enable Metrics/AbcSize

      def add_user_form_properties(form_user, vals)
        JSON.parse(vals[:values])['user_form_properties'].each do |value|
          value = value.merge(user_id: vals[:user_id])
          form_user.user_form_properties.create!(value)
        end

        { form_user: form_user }
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

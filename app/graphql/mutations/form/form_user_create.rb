# frozen_string_literal: true

module Mutations
  module Form
    # For adding form users
    class FormUserCreate < BaseMutation
      argument :form_id, ID, required: true
      argument :user_id, ID, required: true
      argument :prop_values, GraphQL::Types::JSON, required: true

      field :form_user, Types::FormUsersType, null: true
      field :error, String, null: true

      def resolve(vals)
        form = context[:site_community].forms.find(vals[:form_id])
        raise GraphQL::ExecutionError, 'Form not found' if form.nil?

        vals = vals.merge(status_updated_by: context[:current_user])
        u_form = create_form_user(form, vals)

        u_form[:form_user].create_form_task(context[:site_hostname]) if u_form[:form_user].present?
        u_form
      end

      def create_form_user(form, vals)
        form_user = form.form_users.new(vals.except(:form_id, :prop_values)
                                            .merge(status: 'pending'))
        ActiveRecord::Base.transaction do
          return add_user_form_properties(form_user, vals) if form_user.save

          raise GraphQL::ExecutionError, form_user.errors.full_messages
        rescue ActiveRecord::RecordNotUnique
          { error: I18n.t('error.form_user.duplicate_submission') }
        end
      end

      def add_user_form_properties(form_user, vals)
        JSON.parse(vals[:prop_values])['user_form_properties'].each do |value|
          value = value.merge(user_id: vals[:user_id])
          user_prop = form_user.user_form_properties.create!(value.except('image_blob_id'))
          user_prop.attach_file(value) if value.key?('image_blob_id')
        end

        { form_user: form_user }
      end

      def authorized?(vals)
        return true if context[:current_user]&.admin? ||
                       context[:current_user]&.id.eql?(vals[:user_id])

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end

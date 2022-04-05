# frozen_string_literal: true

module Mutations
  module Form
    # For adding form users
    class FormUserCreate < BaseMutation
      argument :form_id, ID, required: true
      argument :user_id, ID, required: false
      argument :prop_values, GraphQL::Types::JSON, required: true
      argument :status, String, required: false

      # Prop Values should be passed in this format
      # propValues: {
      #   user_form_properties: [
      #     {
      #       form_property_id: "xxxxxxxxxxxxxxxxxxxx"
      #       value: "Value",
      #     },
      #     {
      #       form_property_id: "xxxxxxxxxxxxxxxxxxxx",
      #       value: "Val",
      #     },
      #   ]
      # }

      field :form_user, Types::FormUsersType, null: true
      field :error, String, null: true

      def resolve(vals)
        form = context[:site_community].forms.find_by(id: vals[:form_id])
        user = context[:site_community].users.find_by(name: 'anonymous')
        raise_form_not_found_error(form)

        vals = vals.merge(status_updated_by: context[:current_user] || user, user_id: context[:current_user]&.id || user&.id )
        u_form = create_form_user(form, vals)

        u_form[:form_user].create_form_task if u_form[:form_user].present?
        u_form
      end

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def create_form_user(form, vals)
        unless form.multiple_submissions_allowed
          raise_multiple_submissions_error(form, vals[:user_id])
        end

        if vals[:status] == 'draft'
          form.form_users.find_by(user_id: vals[:user_id], status: 'draft')&.destroy!
        end

        form_user = form.form_users.new(vals.except(:form_id, :prop_values)
                                            .merge(status: (vals[:status] || 'pending')))
        ActiveRecord::Base.transaction do
          return add_user_form_properties(form_user, vals) if form_user.save

          raise GraphQL::ExecutionError, form_user.errors.full_messages
        end
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize

      def add_user_form_properties(form_user, vals)
        JSON.parse(vals[:prop_values])['user_form_properties'].each do |value|
          value = value.merge(user_id: vals[:user_id])
          user_prop = form_user.user_form_properties.create!(value.except('image_blob_id'))
          user_prop.attach_file(value) if value.key?('image_blob_id')
        end

        { form_user: form_user }
      end

      def authorized?(vals)
        return true if permissions_checks? ||
                       context[:current_user]&.id.eql?(vals[:user_id])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if form does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_form_not_found_error(form)
        return if form

        raise GraphQL::ExecutionError,
              I18n.t('errors.form.not_found')
      end

      def permissions_checks?
        permitted?(module: :forms, permission: :can_create_form_user)
      end

      # Raises GraphQL execution error if form is already submitted once by the user
      #
      # @param form [Forms::Form]
      # @param user_id [String] User#ids
      #
      # @return [GraphQL::ExecutionError]
      def raise_multiple_submissions_error(form, user_id)
        return unless form.form_users.exists?(user_id: user_id)

        raise GraphQL::ExecutionError, I18n.t('errors.submission.already_made')
      end
    end
  end
end

# frozen_string_literal: true

module Mutations
  module Form
    # For adding form users
    class FormUserCreate < BaseMutation
      argument :form_id, ID, required: true
      argument :user_id, ID, required: true
      argument :prop_values, GraphQL::Types::JSON, required: true
      argument :status, String, required: false
      argument :has_agreed_to_terms, Boolean, required: false

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
        raise_form_not_found_error(form)

        vals = vals.merge(status_updated_by: context[:current_user])
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

        form_user = form.form_users.find_by(user_id: vals[:user_id], status: 'draft')
        raise_error_message(I18n.t('errors.form.draft_exist')) if form_user.present?

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
          # check if this property already exists
          user_prop = check_user_form_property(form_user, value)
          if user_prop.nil?
            user_prop = form_user.user_form_properties.create!(value.except('image_blob_id'))
          end
          user_prop.attachments.attach(value['image_blob_id'])
        end

        { form_user: form_user }
      end

      def check_user_form_property(form_user, vals)
        form_user.user_form_properties.find_by(form_property_id: vals['form_property_id'])
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

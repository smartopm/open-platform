# frozen_string_literal: true

module Mutations
  module Label
    # Create a new Label for the user
    class UserLabelCreate < BaseMutation
      argument :query, String, required: false
      argument :limit, Integer, required: false
      argument :label_id, String, required: true
      argument :user_list, String, required: false

      field :label, [Types::UserLabelType], null: true

      # TODO: move create label operations to background job : Saurabh
      def resolve(label_id:, query: nil, limit: nil, user_list: nil)
        user_ids = (user_list.present? ? user_list.split(',') : list_of_user_ids(query, limit))
        label_ids = label_id.split(',')
        labels = []
        user_ids.each do |u_id|
          user = context[:current_user].find_a_user(u_id)
          label_records = create_user_label(user, label_ids)
          labels += label_records
        end
        { label: labels }
      end

      def create_user_label(user, label_ids)
        new_label_ids = label_ids - user.user_labels.pluck(:label_id)
        return [] if new_label_ids.empty?

        unassociated_label_ids = []
        label_records = generate_user_labels(user, new_label_ids, unassociated_label_ids)

        return label_records if unassociated_label_ids.empty?

        label_titles = context[:site_community].labels.where(id: unassociated_label_ids)
                                               .pluck(:short_desc)

        raise_error_message(I18n.t('errors.user_label.exists', title: label_titles.join(', ')))
      end

      def list_of_user_ids(query, limit)
        users = if query.present? && query.include?('date_filter')
                  Users::User.allowed_users(context[:current_user])
                             .heavy_search(query)
                else
                  Users::User.allowed_users(context[:current_user])
                             .search(query)
                end

        users.order(name: :asc).limit(limit).pluck(:id).uniq
      end

      def generate_user_labels(user, new_label_ids, unassociated_label_ids)
        user_labels = []
        new_label_ids.each do |new_label_id|
          user_label = user.user_labels.create(label_id: new_label_id)
          if user_label.persisted?
            user_labels.push(user_label)
          else
            unassociated_label_ids.push(new_label_id)
          end
        end
        user_labels
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :label, permission: :can_create_user_label)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end

# frozen_string_literal: true

module Types
  # FormType
  class FormUsersType < Types::BaseObject
    field :id, ID, null: false
    field :form_id, ID, null: false
    field :user_id, ID, null: false
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :submitted_by, Types::UserType, null: true,
                                          resolve: Resolvers::BatchResolver.load(:submitted_by)
    field :form, Types::FormType, null: true, resolve: Resolvers::BatchResolver.load(:form)
    field :status, String, null: true
    field :has_agreed_to_terms, Boolean, null: true
    field :comments_count, Integer, null: true
    field :status_updated_by, Types::UserType,
          null: true,
          resolve: Resolvers::BatchResolver.load(:status_updated_by)
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def comments_count
      object.comments.size
    end
  end
end

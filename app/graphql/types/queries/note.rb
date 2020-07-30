# frozen_string_literal: true

# alias for tasks and todos

# Notes queries
module Types::Queries::Note
  extend ActiveSupport::Concern

  included do
    field :all_notes, [Types::NoteType], null: false do
      description 'Returns a list of all the notes'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :user_notes, [Types::NoteType], null: false do
      description 'Returns notes for the specific user'
      argument :id, String, required: true
    end

    field :flagged_notes, [Types::NoteType], null: false do
      description 'Returns a list of all the flagged notes, basically todos'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def all_notes(offset: 0, limit: 50)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    context[:site_community].notes.includes(:user).limit(limit).offset(offset)
  end

  def user_notes(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    context[:site_community].notes.where(user_id: id)
  end

  def flagged_notes(offset: 0, limit: 50)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    context[:site_community].notes.includes(:user, :assignees, :author)
                            .eager_load(:user, :assignee_notes, :assignees)
                            .where(flagged: true)
                            .order(completed: :desc, created_at: :desc)
                            .limit(limit).offset(offset)
  end
end

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

    Note.all.includes(:user).order(created_at: :desc)
        .limit(limit).offset(offset)
  end

  def user_notes(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?
    Note.where(assigned_to: id.split(',')).order(created_at: :desc)
    # context[:current_user].user_notes
  end

  def flagged_notes(offset: 0, limit: 50)
    raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

    Note.includes(:user).where(flagged: true).order(completed: :desc, created_at: :desc)
        .limit(limit).offset(offset)
  end
end

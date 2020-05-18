# frozen_string_literal: true

module Types
  # QueryType
  class QueryType < Types::BaseObject
    include Types::Queries::EventLog
    include Types::Queries::EntryRequest
    include Types::Queries::Message
    include Types::Queries::Showroom
    include Types::Queries::TimeSheet
    include Types::Queries::User
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :community, CommunityType, null: true do
      description 'Find a community by ID'
      argument :id, ID, required: true
    end

    def community(id:)
      Community.find(id) if context[:current_user]
    end

    # Get a list of guards
    field :security_guards, [UserType], null: true do
      description 'Get a list of security guards for a community'
    end

    def security_guards
      return unless context[:current_user]

      User.where(
        community_id: context[:current_user].community_id,
        user_type: 'security_guard',
      ).order(name: :asc)
    end

    field :all_notes, [NoteType], null: false do
      description 'Returns a list of all the notes'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    def all_notes(offset: 0, limit: 50)
      Note.all.order(created_at: :desc)
          .limit(limit).offset(offset)
    end

    field :user_notes, [NoteType], null: false do
      description 'Returns notes for the specific user'
      argument :id, ID, required: true
    end

    def user_notes(id:)
      Note.where(user_id: id).order(created_at: :desc)
    end

    field :flagged_notes, [NoteType], null: false do
      description 'Returns a list of all the flagged notes, basically todos'
    end

    def flagged_notes
      Note.where(flagged: true).order(completed: :desc, created_at: :desc)
    end

    field :entry_search, [EntryRequestType], null: true do
      description 'Find an entry by user'
      argument :name, String, required: true
    end

    def entry_search(name:)
      EntryRequest.where('name ILIKE ?', '%' + name + '%').limit(20)
    end

    # feedback
    field :users_feedback, [FeedbackType], null: true do
      description 'Returns all feedback submitted by the user'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    def users_feedback(offset: 0, limit: 50)
      Feedback.all.order(created_at: :desc)
              .limit(limit).offset(offset)
    end
  end
end

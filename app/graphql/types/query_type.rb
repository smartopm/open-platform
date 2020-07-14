# frozen_string_literal: true

module Types
  # QueryType
  class QueryType < Types::BaseObject
    include Types::Queries::EventLog
    include Types::Queries::EntryRequest
    include Types::Queries::Message
    include Types::Queries::Showroom
    include Types::Queries::TimeSheet
    include Types::Queries::Comment
    include Types::Queries::User
    include Types::Queries::Business
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :community, CommunityType, null: true do
      description 'Find a community by ID'
      argument :id, ID, required: true
    end

    def community(id:)
      raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

      Community.find(id)
    end

    field :all_notes, [NoteType], null: false do
      description 'Returns a list of all the notes'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    def all_notes(offset: 0, limit: 50)
      raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

      Note.all.includes(:user).order(created_at: :desc)
          .limit(limit).offset(offset)
    end

    field :user_notes, [NoteType], null: false do
      description 'Returns notes for the specific user'
      argument :id, ID, required: true
    end

    def user_notes(id:)
      raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

      Note.where(user_id: id).order(created_at: :desc)
    end

    field :flagged_notes, [NoteType], null: false do
      description 'Returns a list of all the flagged notes, basically todos'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    def flagged_notes(offset: 0, limit: 50)
      raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

      Note.includes(:user).where(flagged: true).order(completed: :desc, created_at: :desc)
          .limit(limit).offset(offset)
    end

    field :entry_search, [EntryRequestType], null: true do
      description 'Find an entry by user'
      argument :name, String, required: true
    end

    def entry_search(name:)
      raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]

      context[:site_community].entry_requests.where('name ILIKE ?', '%' + name + '%').limit(20)
    end

    # feedback
    field :users_feedback, [FeedbackType], null: true do
      description 'Returns all feedback submitted by the user'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    def users_feedback(offset: 0, limit: 50)
      raise GraphQL::ExecutionError, 'Unauthorized' if current_user&.admin?

      Feedback.all.order(created_at: :desc)
              .limit(limit).offset(offset)
    end

    field :campaigns, [Types::CampaignType], null: true do
      description 'Get a list of all Campaigns'
    end

    def campaigns
      raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

      campaign = context[:site_community].campaigns.offset(0).limit(100)
      campaign
    end

    field :campaign, Types::CampaignType, null: true do
      description 'Find Campaign by Id'
      argument :id, ID, required: true
    end

    def campaign(id:)
      raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

      campaign = context[:site_community].campaigns.find_by(id: id)
      campaign
    end
  end
end

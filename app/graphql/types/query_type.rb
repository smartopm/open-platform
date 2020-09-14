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
    include Types::Queries::Label
    include Types::Queries::Note
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
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    def campaigns(offset: 0, limit: 10)
      raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

      campaign = context[:site_community].campaigns.offset(offset).limit(limit)
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

    def admin_or_self(id)
      context[:current_user]&.admin? || context[:current_user]&.id.eql?(id)
    end

    field :discussion_user, Types::DiscussionUserType, null: true do
      description 'Get a discussionUser subscription'
      argument :disucssion_id, String, required: true
    end
    def discussion_user(disucssion_id:)
      raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

      DiscussionUser.find_by(user_id: context[:current_user].id, discussion_id: disucssion_id)
    end
  end
end

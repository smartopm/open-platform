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
    include Types::Queries::Form
    include Types::Queries::ActionFlow
    include Types::Queries::LandParcel
    include Types::Queries::PostTag
    include Types::Queries::Community
    include Types::Queries::Invoice
    include Types::Queries::EmailTemplate
    include Types::Queries::Deposit
    include Types::Queries::Payment
    include Types::Queries::Wallet
    include Types::Queries::Balance
    include Types::Queries::Transaction
    include Types::Queries::PaymentPlan
    include Types::Queries::PlanPayment
    include Types::Queries::SubscriptionPlan
    include Types::Queries::Discussion
    include Types::Queries::Campaign
    include Types::Queries::Process
    include Types::Queries::LeadLog
    include Types::Queries::Post
    include Types::Queries::Notification
    include Types::Queries::Amenity
    include Types::Queries::TransactionLog

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :entry_search, [EntryRequestType], null: true do
      description 'Find an entry by user'
      argument :name, String, required: true
    end

    def entry_search(name:)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless context[:current_user]

      context[:site_community].entry_requests.where('name ILIKE ?', "%#{name}%").limit(20)
    end

    # feedback
    field :users_feedback, [FeedbackType], null: true do
      description 'Returns all feedback submitted by the user'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    def users_feedback(offset: 0, limit: 50)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless current_user&.admin?

      context[:site_community].feedbacks.all.order(created_at: :desc)
                              .limit(limit).offset(offset)
    end

    def admin_or_self(id)
      context[:current_user]&.admin? || context[:current_user]&.id.eql?(id)
    end

    field :discussion_user, Types::DiscussionUserType, null: true do
      description 'Get a discussionUser subscription'
      argument :disucssion_id, String, required: true
    end
    def discussion_user(disucssion_id:)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

      Discussions::DiscussionUser.find_by(
        user_id: context[:current_user].id, discussion_id: disucssion_id,
      )
    end

    # Verifies user

    #
    # @param user_id [String]
    #
    # @return [User] if user is valid
    # @return [GraphQL::ExecutionError]
    def verified_user(user_id)
      unless context[:current_user]&.id == user_id || context[:current_user]&.admin?
        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      user = Users::User.allowed_users(context[:current_user]).find_by(id: user_id)
      return user if user.present?

      raise GraphQL::ExecutionError, I18n.t('errors.user.does_not_exist')
    end
  end
end

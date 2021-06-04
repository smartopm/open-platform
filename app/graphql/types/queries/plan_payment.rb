# frozen_string_literal: true

# PlanPayment queries
module Types::Queries::PlanPayment
    extend ActiveSupport::Concern
  
    included do
      # Get payments list
      field :payments_list, [Types::PlanPaymentType], null: true do
        description 'Get list of all payments - plan payments'
        argument :offset, Integer, required: false
        argument :limit, Integer, required: false
        argument :query, String, required: false
      end
    end
  
    def payments_list(query: nil, limit: nil, offset: 0)
        unless context[:current_user]&.admin?
            raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
          end
      
        context[:site_community].plan_payments.search(query)
                                  .eager_load(:user, :payment_plan)
                                  .order(created_at: :desc)
                                  .limit(limit).offset(offset)
    end
  end

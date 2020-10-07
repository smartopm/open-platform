# frozen_string_literal: true

# form queries
module Types::Queries::Form
    extend ActiveSupport::Concern
  
    included do
      # Get form entries
      field :forms, [Types::FormType], null: true do
        description 'Get all forms'
      end
  
      # Get form for the user, using the user id
      field :form, Types::FormType, null: true do
        description 'Get form by its id'
        argument :id, GraphQL::Types::ID, required: true
      end
    end
  
    def forms
      raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?
  
      context[:site_community].forms
    end
  
    def form(id:)
      raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?
  
      context[:site_community].forms.find(id)
    end
  end
  
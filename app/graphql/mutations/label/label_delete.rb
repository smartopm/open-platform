# frozen_string_literal: true

module Mutations
  module Label
    # LabelDelete
    class LabelDelete < BaseMutation
      argument :id, ID, required: true

      field :label_delete, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        label_delete = context[:site_community].labels.find_by(id: id)
        raise GraphQL::ExecutionError, 'Label not found' if label_delete.nil?

        label_delete&.user_labels.where(label_id: id)&.delete
        label_delete&.campaign_labels.where(label_id: id)&.delete 
      
        # UserLabel.where(label_id: id).delete unless label_delete.nil?
        # CampaignLabel.where(label_id: id)&.delete unless label_delete.nil?

        label_delete&.update(status: 'deleted')
        
        return { label_delete: label_delete } if label_delete

        raise GraphQL::ExecutionError, label_delete.errors.full_message
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end

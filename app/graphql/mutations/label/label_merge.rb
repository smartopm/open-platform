module Mutations
  module Label
    # merge labels
    class LabelMerge < BaseMutation
      argument :label_id, ID, required: true
      argument :merge_label_id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(label_id:, merge_label_id:)
        label = context[:site_community].labels.find_by(id: label_id)
        merge_label = context[:site_community].labels.find_by(id: merge_label_id)
        raise GraphQL::ExecutionError, 'Label not found' if label.nil? || merge_label.nil?

        label.user_labels.each do |lab|
          merge_label.user_labels.create!(lab)
        end
      end
    end
  end
end
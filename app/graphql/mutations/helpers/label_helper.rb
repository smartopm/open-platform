# frozen_string_literal: true

module Mutations
  module Helpers
    # Helper methods for label mutations
    module LabelHelper
      def get_label_details(short_desc)
        split_label = short_desc.split('::')
        short_desc = split_label.pop
        grouping_name = split_label.join('::') unless split_label.empty?
        [short_desc, grouping_name]
      end
    end
  end
end

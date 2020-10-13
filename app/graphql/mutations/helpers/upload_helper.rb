# frozen_string_literal: true

module Mutations
  module Helpers
    # Helper methods for attaching image to object
    module UploadHelper
      def attach_image(obj, vals)
        obj.class.name.constantize::IMAGE_ATTACHMENTS.each_pair do |key, attr|
          obj.send(attr).attach(vals[key]) if vals[key] || vals[key.to_s]
        end
      end
    end
  end
end

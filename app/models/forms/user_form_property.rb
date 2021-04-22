# frozen_string_literal: true

module Forms
  # Form User Form Properties Record
  class UserFormProperty < ApplicationRecord
    has_one_attached :image

    belongs_to :form_property
    belongs_to :form_user
    belongs_to :user, class_name: 'Users::User'

    IMAGE_ATTACHMENTS = {
      image_blob_id: :image,
    }.freeze

    def attach_file(vals)
      IMAGE_ATTACHMENTS.each_pair do |_key, attr|
        send(attr).attach(vals['image_blob_id'])
      end
    end
  end
end

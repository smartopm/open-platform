# frozen_string_literal: true

# Form User Form Properties Record
class UserFormProperty < ApplicationRecord
  has_one_attached :image

  belongs_to :form_property
  belongs_to :form_user
  belongs_to :user

  IMAGE_ATTACHMENTS = {
    image_blob_id: :image,
  }.freeze
end

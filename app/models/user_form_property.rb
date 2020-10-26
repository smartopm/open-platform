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

  def attach_file(vals)
    IMAGE_ATTACHMENTS.each_pair do |key, attr|
      self.send(attr).attach(vals['image_blob_id'])
    end
  end
end

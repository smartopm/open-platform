# frozen_string_literal: true

# Auth check on activestorage urls
class SecureBlobsController < ActiveStorage::BaseController
  include ActiveStorage::SetBlob
  include Authorizable

  def show
    if current_user.present? && owner_verified?
      redirect_to @blob.service_url(disposition: params[:disposition])
    else
      redirect_to '/'
    end
  end

  private

  def owner_verified?
    file = ActiveStorage::Attachment.find_by(blob_id: @blob.id)
    return false if file.nil?

    return true if file.record_type != 'Forms::UserFormProperty'

    user_id = Forms::UserFormProperty.find_by(id: file.record_id)&.user_id
    current_user.admin? || user_id.eql?(current_user.id)
  end
end

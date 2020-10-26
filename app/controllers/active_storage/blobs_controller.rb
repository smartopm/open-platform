# frozen_string_literal: true

# Overridng ActiceStorage controller
class ActiveStorage::BlobsController < ActiveStorage::BaseController
  include ActiveStorage::SetBlob
  include Authorizable

  def show
    if auth_user.present?
      redirect_to @blob.service_url(disposition: params[:disposition]) if owner_verified?
    else
      redirect_to '/'
    end
  end

  private

  def auth_user
    auth = auth_context(request)
    auth[:current_user]
  end

  def owner_verified?
    record_id = ActiveStorage::Attachment.find_by(blob_id: @blob.id).record_id
    user_id = UserFormProperty.find_by(id: record_id)&.user_id
    auth_user.admin? || user_id.eql?(auth_user.id)
  end
end

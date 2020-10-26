# frozen_string_literal: true

# Overridng ActiceStorage controller
class ActiveStorage::BlobsController < ActiveStorage::BaseController
  include ActiveStorage::SetBlob
  include Authorizable

  def show
    if check_auth
      redirect_to @blob.service_url(disposition: params[:disposition])
    else
      redirect_to '/'
    end
  end

  private

  def check_auth
    auth = auth_context(request)
    auth[:current_user].present?
  end
end

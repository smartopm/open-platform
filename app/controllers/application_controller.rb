# frozen_string_literal: true

# Primary ApplicationController
class ApplicationController < ActionController::Base
  helper_method :current_member
  before_action :current_community
  before_action :set_paper_trail_whodunnit

  def new_session_path(_scope)
    user_google_oauth2_omniauth_authorize_path
  end

  def current_community
    community_list = { 'app.doublegdp.com' => 'Nkwashi',
                       'double-gdp-staging.herokuapp.com' => 'Nkwashi',
                       'femoza.doublegdp.com' => 'Nkwanzi',
                       'dev.dgdp.site' => 'Nkwanzi'
                      }

    # if request.domain == 'dgdp.site'
    #   @site_community = Community.find_by(name: 'Nkwashi')
    # else
    # end
    dom = "#{request.subdomain}.#{request.domain}"
    @site_community = Community.find_by(name: community_list[dom])
    @site_community
  end

  # For now we can assume that each user is just a member of one community
  def authenticate_member!
    authenticate_user!
    # Keep out any user that not a member of a community
    current_user.assign_default_community(@site_community)
    redirect_to '/hold' unless current_user.community
  end
end

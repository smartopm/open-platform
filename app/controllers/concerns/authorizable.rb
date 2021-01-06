# frozen_string_literal: true

# Abstracts authorization methods
module Authorizable
  extend ActiveSupport::Concern

  included do
    helper_method :current_member
    before_action :current_community
    before_action :set_paper_trail_whodunnit
  end

  def new_session_path(_scope)
    user_google_oauth2_omniauth_authorize_path
  end

  def current_hostname
    request.host
  end

  # rubocop:disable Metrics/MethodLength
  def current_community
    community_list = { 'app.doublegdp.com' => 'Nkwashi',
                       'double-gdp-staging.herokuapp.com' => 'Nkwashi',
                       'femoza.doublegdp.com' => 'Femoza',
                       'femoza-staging.doublegdp.com' => 'Femoza', 'dev.dgdp.site' => 'Femoza' }

    if request.domain == 'dgdp.site' && request.subdomain != 'dev'
      @site_community = Community.find_by(name: 'Nkwashi')
    else
      dom = "#{request.subdomain}.#{request.domain}"
      @site_community = Community.find_by(name: community_list[dom])
    end
    @site_community
  end
  # rubocop:enable Metrics/MethodLength

  # For now we can assume that each user is just a member of one community
  def authenticate_member!
    authenticate_user!
    # Keep out any user that not a member of a community
    current_user.assign_default_community(@site_community)
    redirect_to '/hold' unless current_user.community
  end

  def auth_context(request)
    token = bearer_token(request)
    return { site_community: @site_community } unless token

    user = @site_community.users.find_via_auth_token(token, @site_community)

    log_active_user(user)
    {
      current_user: user,
      site_community: @site_community,
      site_hostname: current_hostname,
    }
  end

  private

  def bearer_token(request)
    pattern = /^Bearer /
    header  = request.headers['Authorization']
    header.gsub(pattern, '') if header&.match(pattern)
  end

  def log_active_user(user)
    cache_key = log_cache_key(user)
    cached = Rails.cache.read(cache_key)
    return if cached && Time.zone.at(cached) > Time.zone.now

    EventLog.log_user_activity_daily(user)
    Rails.cache.write(cache_key, 8.hours.from_now.to_i, expires_in: 8.hours)
  end

  def log_cache_key(user)
    "us-#{user.id}"
  end
end

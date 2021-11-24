# frozen_string_literal: true

# Abstracts authorization methods
module Authorizable
  extend ActiveSupport::Concern

  included do
    helper_method :current_member
    helper_method :current_community
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
                       'demo.doublegdp.com' => 'DoubleGDP',
                       'demo-staging.doublegdp.com' => 'DoubleGDP',
                       'morazancity.doublegdp.com' => 'Ciudad Morazán',
                       'morazancity-staging.doublegdp.com' => 'Ciudad Morazán',
                       'tilisi-staging.doublegdp.com' => 'Tilisi',
                       'tilisi.doublegdp.com' => 'Tilisi',
                       'dev.dgdp.site' => 'DoubleGDP',
                       'double-gdp-dev.herokuapp.com' => 'DAST' }
    if ['dgdp.site', 'rails'].include?(request.domain) && request.subdomain != 'dev'
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

    check_user_role(user)
    log_active_user(user)
    {
      current_user: user,
      site_community: @site_community,
      site_hostname: current_hostname,
    }
  end

  def current_user
    auth_context(request)[:current_user]
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

    Logs::EventLog.log_user_activity_daily(user)
    Rails.cache.write(cache_key, 8.hours.from_now.to_i, expires_in: 8.hours)
  end

  def log_cache_key(user)
    "us-#{user.id}"
  end

  def check_user_role(user)
    return if Role.exists?(name: user.role.name, community_id: ["id", nil])

    redirect_to '/hold'
  end
end

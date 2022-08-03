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

  def current_community
    domains = ['dgdp.site', 'rails']
    @current_community ||= if domains.include?(request.domain) && request.subdomain != 'dev'
                             Community.find_by(name: 'DoubleGDP')
                           else
                             dom = "#{request.subdomain}.#{request.domain}"
                             Community.where('? = ANY(domains)', dom).first
                           end
  end

  # For now we can assume that each user is just a member of one community
  def authenticate_member!
    authenticate_user!
    # Keep out any user that not a member of a community
    current_user.assign_default_community(@current_community)
    redirect_to '/hold' unless current_user.community
  end

  def auth_context(request)
    token = bearer_token(request)
    return { site_community: @current_community } unless token

    user = @current_community.users.find_via_auth_token(token, @current_community)

    check_user_role(user)
    log_active_user(user)
    {
      current_user: user,
      site_community: @current_community,
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
    return if Role.exists?(name: user.role.name,
                           community_id: [nil, @current_community.id])

    redirect_to '/hold'
  end
end

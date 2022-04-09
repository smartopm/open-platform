# frozen_string_literal: true

# ServiceWorkerController
class ServiceWorkerController < ApplicationController
  protect_from_forgery except: :service_worker

  def service_worker; end

  def manifest
    @manifest = manifest_by_community
    render json: @manifest
  end

  def offline; end

  private

  # TODO: Refactor this method to get community_name, color and path from the community table
  def manifest_by_community
    community_name = current_community.name

    if community_name.eql?('Ciudad Morazán')
      return manifest_file(community_name, '#0C1F85', 'ciudadmorazan/')
    end

    if community_name.eql?('Greenpark')
      return manifest_file(community_name, '#008C44', 'greenpark/')
    end

    if community_name.eql?('Metropolis')
      # TODO: Fix color once ticket is updated
      return manifest_file(community_name, '#008C44', 'metropolis/')
    end

    return manifest_file(community_name, '#008C44', 'enyimba/') if community_name.eql?('Enyimba')

    manifest_file(community_name)
  end

  # rubocop:disable Metrics/MethodLength
  # defaults to Nkwashi theme & icons
  def manifest_file(community_name, theme_color = '#69ABA4', icon_path = '')
    {
      name: community_name.to_s,
      short_name: "#{community_name} App",
      start_url: '/',
      icons: [
        {
          src: icon_src("#{icon_path}home_512.png"),
          type: 'image/png',
          sizes: '512x512',
        },
        {
          src: icon_src("#{icon_path}home_192.png"),
          type: 'image/png',
          sizes: '192x192',
        },
        {
          src: icon_src("#{icon_path}home_144.png"),
          type: 'image/png',
          sizes: '144x144',
        },
        {
          src: icon_src("#{icon_path}home_96.png"),
          type: 'image/png',
          sizes: '96x96',
        },
        {
          src: icon_src("#{icon_path}home_72.png"),
          type: 'image/png',
          sizes: '72x72',
        },
        {
          src: icon_src("#{icon_path}home_48.png"),
          type: 'image/png',
          sizes: '48x48',
        },
        {
          src: icon_src("#{icon_path}home_36.png"),
          type: 'image/png',
          sizes: '36x36',
        },
      ],
      theme_color: theme_color.to_s,
      background_color: '#FFFFFF',
      display: 'standalone',
      orientation: 'portrait',
    }
  end
  # rubocop:enable Metrics/MethodLength

  def icon_src(path)
    ActionController::Base.helpers.asset_path(path)
  rescue Sprockets::Rails::Helper::AssetNotFound
    ''
  end
end

# frozen_string_literal: true

# Primary ApplicationController
class ApplicationController < ActionController::Base
  include Authorizable

  around_action :set_time_zone, if: :current_community
  before_action :set_locale
  before_action :allow_iframe_on_forms

  private

  def allow_iframe_on_forms
    return unless request.fullpath.include?('/form')

    form_id = request.fullpath.split('/')[2]
    public_form = current_community&.forms&.find_by(id: form_id, is_public: true)
    # only allow iframes if the form exists
    response.headers.delete 'X-Frame-Options' unless public_form.nil?
  end

  # Sets locale to lookup for translation.
  # @example community language is set to esponal(es-ES)
  #   "I18n.locale" => "es-ES"
  # * It will look for the translation in es-ES.yml.
  def set_locale
    I18n.locale = extract_locale || I18n.default_locale
  end

  # Extracts locale (en, es) from Community#language (en-US).
  #
  # @return [String, NilClass]
  def extract_locale
    return unless current_community&.language

    current_community.language[/.*(?=-)|.*/]
  end

  # rubocop:disable Naming/AccessorMethodName
  def set_time_zone(&block)
    Time.use_zone(current_community.timezone, &block)
  end
  # rubocop:enable Naming/AccessorMethodName
end

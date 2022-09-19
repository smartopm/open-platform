# frozen_string_literal: true

require 'base64'

module ApplicationHelper # rubocop:disable Style/Documentation
  def inline_svg_img(svg_str)
    # This should always be HTML safe
    "<img alt='' src='data:image/svg+xml;base64,#{Base64.encode64(svg_str)}'"
      .html_safe # rubocop:disable Rails/OutputSafety
  end

  # Returns an SVG of the qrcode text
  def qrcode(txt)
    qrcode = RQRCode::QRCode.new(txt)
    qrcode.as_svg
  end

  # Returns an SVG of the qrcode as an inline image
  def qrcode_element(txt)
    inline_svg_img(qrcode(txt))
  end

  # rubocop:disable Rails/HelperInstanceVariable
  def wordpress_post_info(current_path, wp_link)
    id = post_id(current_path)
    return {} unless id

    @post ||= wordpress_post(id, wp_link)
    return {} unless @post

    {
      title: @post['title'],
      description: strip_tags(@post['excerpt'])&.truncate(100, separator: ' '),
      image: @post['featured_image'],
    }
  end
  # rubocop:enable Rails/HelperInstanceVariable

  private

  def wordpress_post(post_id, wp_link)
    res = Net::HTTP.get_response(URI.parse("#{wp_link}/posts/#{post_id}"))
    JSON.parse(res.body)
  rescue StandardError
    nil
  end

  def post_id(current_path)
    path_info = current_path.split('/').reject(&:blank?)
    return unless path_info.first(2) == %w[news post] && path_info.length == 3

    path_info.last
  end

  # format: '{"PUBLIC_KEY": "FLWPUBK, "PRIVATE_KEY": "FLWSECK", "ENCRYPTION_KEY": "FLWENCK"}'
  def flutterwave_keys(community_name)
    JSON.parse(ENV["#{capitized_community_name(community_name)}_FLUTTERWAVE"] || '{}')
  end

  # format: '{"CREATE_USER": "abc/999", "UPDATE_USER": "abc/123"}'
  def zapier_webhook_id(community_name)
    JSON.parse(ENV["#{capitized_community_name(community_name)}_ZAPIER_WEBHOOK_ID"] || '{}')
  end

  def capitized_community_name(community_name)
    community_name.parameterize.underscore.upcase
  end
end

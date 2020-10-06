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
  def wordpress_post_info(current_path)
    id = post_id(current_path)
    return {} unless id

    @post ||= wordpress_post(id)
    return {} unless @post

    {
      title: @post['title'],
      description: strip_tags(@post['excerpt'])&.truncate(100, separator: ' '),
      image: @post['featured_image'],
    }
  end
  # rubocop:enable Rails/HelperInstanceVariable

  private

  # rubocop:disable Metrics/LineLength:
  def wordpress_post(post_id)
    res = Net::HTTP.get_response(URI.parse("https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/posts/#{post_id}"))
    JSON.parse(res.body)
  rescue StandardError
    nil
  end
  # rubocop:enable Metrics/LineLength:

  def post_id(current_path)
    path_info = current_path.split('/').reject(&:blank?)
    return unless path_info.first(2) == %w[news post] && path_info.length == 3

    path_info.last
  end
end

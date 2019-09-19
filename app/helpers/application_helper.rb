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
end

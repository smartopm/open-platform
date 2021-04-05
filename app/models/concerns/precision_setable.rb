# frozen_string_literal: true

# sets precision to 2 decimal places before save for all the balance related columns
module PrecisionSetable
  extend ActiveSupport::Concern

  included do
    before_save :set_precision
  end

  PRECISION_ATTRIBUTES = %w[plot_balance amount pending_amount balance pending_balance].freeze

  def set_precision
    (changed_attributes.keys & PRECISION_ATTRIBUTES).each do |attr|
      send("#{attr}=", send(attr).round(2))
    end
  end
end

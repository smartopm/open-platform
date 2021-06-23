# frozen_string_literal: true

# Custom date type
module Types
  module Scalar
    class DateType < BaseScalar
      description 'Handle date/time in community timezone'

      def self.coerce_input(value, _ctx)
        value
      end

      def self.coerce_result(value, ctx)
        value.in_time_zone(ctx[:site_community].timezone)
      end
    end
  end
end
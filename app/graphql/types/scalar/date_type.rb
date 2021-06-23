# frozen_string_literal: true

module Types
  module Scalar
    # Custom date type
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

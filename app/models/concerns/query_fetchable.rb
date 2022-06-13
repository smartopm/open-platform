# frozen_string_literal: true

# Module for handling common SQL queries used across models
module QueryFetchable
  extend ActiveSupport::Concern

  def self.accent_insensitive_search(column_name, pattern)
    "unaccent(LOWER(#{column_name})) LIKE unaccent(LOWER(#{pattern}))"
  end
end

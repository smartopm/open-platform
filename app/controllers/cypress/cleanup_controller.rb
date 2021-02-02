# frozen_string_literal: true

# Cypress support to clean up test db
class Cypress::CleanupController < ApplicationController
  skip_before_action :verify_authenticity_token

  def destroy
    return head(:bad_request) unless Rails.env.test?

    tables = ActiveRecord::Base.connection.tables - %w(ar_internal_metadata)
    tables.delete 'schema_migrations'
    tables.each do |t|
      ActiveRecord::Base.connection.execute("TRUNCATE #{t} CASCADE")
    end

    head :ok
  end
end

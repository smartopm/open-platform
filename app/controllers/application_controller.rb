# frozen_string_literal: true

# Primary ApplicationController
class ApplicationController < ActionController::Base
  include Authorizable
end

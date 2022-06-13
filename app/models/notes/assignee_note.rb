# frozen_string_literal: true

require 'email_msg'
require 'host_env'

module Notes
  # AssigneeNote
  class AssigneeNote < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :note

    has_paper_trail
  end
end

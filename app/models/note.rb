# frozen_string_literal: true

# Notes for the CRM portion of the app, attached to a user
class Note < ApplicationRecord
  belongs_to :user
  belongs_to :author, class: 'User'
end

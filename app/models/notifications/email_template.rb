# frozen_string_literal: true

module Notifications
  # email templates
  class EmailTemplate < ApplicationRecord
    scope :system_emails, -> { where(tag: 'system') }

    belongs_to :community

    validates :name, presence: true, uniqueness: {
      scope: :community_id,
      message: 'Email template with name already exists for community',
    }

    before_save :set_template_variables

    def set_template_variables
      self.template_variables = {
        body: extract_variables(body),
        subject: extract_variables(subject),
      }.to_json
    end

    def variable_names
      body_vars = extract_variables(body)
      subject_vars = extract_variables(subject)
      body_vars + subject_vars
    end

    private

    def extract_variables(text)
      return if text.nil?

      text.scan(/%([a-zA-Z_]*?)%/i).flatten.uniq
    end
  end
end

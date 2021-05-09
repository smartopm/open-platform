# frozen_string_literal: true

# email templates
class EmailTemplate < ApplicationRecord
  scope :system_emails, -> { where(tag: 'system') }

  belongs_to :community

  validates :name, presence: true, uniqueness: true

  before_save :set_template_variables

  def set_template_variables
    self.template_variables = {
      body: extract_variables(body),
      subject: extract_variables(subject),
    }.to_json
  end

  def extract_variables(text)
    return if text.nil?

    text.scan(/%(.*?)%/i).flatten
  end

  # I don't think we need to save the variables in the DB as you've done above: Nurudeen
  def variable_names
    body_vars = body.scan(/%([a-zA-Z_]*?)%/i).flatten.uniq
    subject_vars = subject.scan(/%([a-zA-Z_]*?)%/i).flatten.uniq
    body_vars + subject_vars
  end
end

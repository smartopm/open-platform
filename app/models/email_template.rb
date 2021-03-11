# frozen_string_literal: true

# email templates
class EmailTemplate < ApplicationRecord
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
    vars = text.split(' ').map do |word|
      next unless word.starts_with?('${')

      word[2...word.index('}')]
    end
    vars.compact
  end
end

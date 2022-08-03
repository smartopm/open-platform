# frozen_string_literal: true

# returns field values for actions defined in action flows
module ActionFieldsFetchable
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/AbcSize
  def self.process_vars(field, data, field_config)
    return unless field_config[field]

    field_value = field_config[field]['value']
    return data[field_value.to_sym] if field_config[field]['type'] == 'variable'

    vars_in_field_value = field_value.scan(/%([a-zA-Z_]*?)%/i).flatten.uniq
    if vars_in_field_value.present?
      vars_in_field_value.each { |var| field_value.gsub!("%#{var}%", data[var.to_sym].to_s) }
    end

    field_value
  end
  # rubocop:enable Metrics/AbcSize
end

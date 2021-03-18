# frozen_string_literal: true

# returns field values for actions defined in action flows
module ActionFieldsFetchable
  extend ActiveSupport::Concern

  def self.process_vars(field, data, field_config)
    return unless field_config[field]

    if field_config[field]['type'] == 'variable'
      return data[(field_config[field]['value']).to_sym]
    end

    field_config[field]['value']
  end
end

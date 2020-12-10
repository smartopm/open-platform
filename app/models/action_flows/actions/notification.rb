module ActionFlows
	module Actions
		# Action defined for sending in-app notifications
		class Notification
			ACTION_FIELDS = [
				{ name: 'label', type: 'text' },
				{ name: 'user_id', type: 'text' },
				{ name: 'message', type: 'text' },
			].freeze
			
			def process_vars(field, data, field_config)
				return unless field_config[field]

        if field_config[field]['type'] == 'variable'
          return data[(field_config[field]['value']).to_sym]
        end

				field_config[field]['value']
			end
	
			def self.execute_action(data, field_config)
				label = process_vars('label', data, field_config) || ''
				user_id = process_vars('user_id', data, field_config) || ''
				message = process_vars('messsage', data, field_config) || ''
				
				Notifier.send_from_action(message, label, user_id)
			end
		end
	end
end
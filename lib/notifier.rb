# class helper to handle sending of notifications in the app
class Notifier
	class NotifierError < StandardError; end
	
	# public interface used by the notification action in action_flows
	def self.send_from_action(message_body, data = {})
		label = data[:label]
		user_id = data[:user_id]

		return if label.blank? && user_id.blank?

		user_group =  user_list_from_label(label)
		users_to_notify = user_group || [user_id]
		
		return if users_to_notify.blank?

		short_desc = 'Notification sent from Action Flow'
		community_id = community_id(label, user_id)

		users_to_notify.each do |_user_id|
			send_in_app_notification(_user_id, message_body, short_desc, community_id)
		end
	end

	private

	def user_list_from_label(short_desc)
		label = label(short_desc)

		return label.users.pluck(:id) if label

		nil
	end

	def label(short_desc)
		return nil if short_desc.blank?

		Label.where(short_desc: short_desc)
					.includes(:users, :community).first
	end

	def community_id(label, user_id)
		return nil if label.blank? && user_id.blank?
		
		community_id = label(label).community[:id] || user(user_id).community[:id]

		community_id
	end
	
	def user(user_id)
		User.where(id: user_id)
				.includes(:community).first
	end

	def send_in_app_notification(user, data = {})
		return if user.blank? || data[:community_id].nil?

		ActiveRecord::Base.transaction do
			new_message = Message.create(
					user_id: user,
					message: data[:message] || ''
			)
			
			Notification.create(
					notifable_id: new_message[:id],
					notifable_type: 'Message',
					user_id: user,
					description: data[:short_desc] || '',
					community_id: data[:community_id]
			)

			# fail gracefully
		rescue StandardError => e
			Rails.logger.warn e.full_message
		end
	end
end

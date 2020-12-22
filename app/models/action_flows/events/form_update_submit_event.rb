# frozen_string_literal: true

module ActionFlows
  module Events
    # Form Update Submit Event to handle related action
    class FormUpdateSubmitEvent < ActionFlows::EventPop
      EVENT_TYPE = 'form_update_submit'
      EVENT_DESC = 'Form Update Submit'

      def self.event_metadata
        {
          'FormUser' => obj_data['FormUser'],
        }
      end

      def self.event_metadata_list
        {
          #  FormUpdateSubmitEvent.event_metadata.values.map{|v| v.values }
        }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      # rubocop:disable Metrics/MethodLength
      def preload_data(eventlog)
        form_user = eventlog.ref_type.constantize.find eventlog.ref_id
        reviewers_email = '' # to be initialized with comma separated emails
        load_data(
          { 'FormUser' => form_user },
          'form_name' => form_user.form.name,
          'user_name' => form_user.user.name,
          'user_email' => form_user.user.email,
          'reviewers_email' => reviewers_email,
          'url' => url_format(form_user.id),
          'has_status_changed' => status_changed?(eventlog),
        )
      end
      # rubocop:enable Metrics/MethodLength

      def url_format(_id)
        "https://#{ENV['HOST']}/forms"
      end

      def status_changed?(eventlog)
        return false if eventlog.data.nil?

        eventlog.data.keys.include?('from_status') && eventlog.data.keys.include?('to_status')
      end
    end
  end
end
